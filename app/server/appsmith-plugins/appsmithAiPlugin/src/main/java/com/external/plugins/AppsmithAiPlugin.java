package com.external.plugins;

import com.appsmith.external.dtos.ExecuteActionDTO;
import com.appsmith.external.exceptions.pluginExceptions.AppsmithPluginError;
import com.appsmith.external.exceptions.pluginExceptions.AppsmithPluginException;
import com.appsmith.external.helpers.restApiUtils.connections.APIConnection;
import com.appsmith.external.helpers.restApiUtils.connections.ApiKeyAuthentication;
import com.appsmith.external.helpers.restApiUtils.helpers.RequestCaptureFilter;
import com.appsmith.external.models.ActionConfiguration;
import com.appsmith.external.models.ActionExecutionRequest;
import com.appsmith.external.models.ActionExecutionResult;
import com.appsmith.external.models.ApiKeyAuth;
import com.appsmith.external.models.DatasourceConfiguration;
import com.appsmith.external.plugins.BasePlugin;
import com.appsmith.external.plugins.BaseRestApiPluginExecutor;
import com.appsmith.external.services.SharedConfig;
import com.external.plugins.dtos.AiServerRequestDTO;
import com.external.plugins.dtos.Query;
import com.external.plugins.models.Feature;
import com.external.plugins.services.AiFeatureService;
import com.external.plugins.services.AiFeatureServiceFactory;
import com.external.plugins.services.AiServerService;
import com.external.plugins.services.AiServerServiceImpl;
import com.external.plugins.utils.RequestUtils;
import lombok.extern.slf4j.Slf4j;
import org.pf4j.PluginWrapper;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static com.external.plugins.constants.AppsmithAiConstants.USECASE;

@Slf4j
public class AppsmithAiPlugin extends BasePlugin {

    public AppsmithAiPlugin(PluginWrapper wrapper) {
        super(wrapper);
    }

    public static class AppsmithAiPluginExecutor extends BaseRestApiPluginExecutor {
        private static final AiServerService aiServerService = new AiServerServiceImpl(objectMapper);

        public AppsmithAiPluginExecutor(SharedConfig config) {
            super(config);
        }

        @Override
        public Mono<APIConnection> datasourceCreate(DatasourceConfiguration datasourceConfiguration) {
            ApiKeyAuth apiKeyAuth = new ApiKeyAuth();
            apiKeyAuth.setValue("test-key");
            return ApiKeyAuthentication.create(apiKeyAuth)
                    .flatMap(apiKeyAuthentication -> Mono.just((APIConnection) apiKeyAuthentication));
        }

        @Override
        public Mono<ActionExecutionResult> executeParameterized(
                APIConnection connection,
                ExecuteActionDTO executeActionDTO,
                DatasourceConfiguration datasourceConfiguration,
                ActionConfiguration actionConfiguration) {

            // Get input from action configuration
            List<Map.Entry<String, String>> parameters = new ArrayList<>();

            prepareConfigurationsForExecution(executeActionDTO, actionConfiguration, datasourceConfiguration);
            // Filter out any empty headers
            headerUtils.removeEmptyHeaders(actionConfiguration);
            headerUtils.setHeaderFromAutoGeneratedHeaders(actionConfiguration);

            return this.executeCommon(
                    connection, datasourceConfiguration, actionConfiguration, parameters, executeActionDTO);
        }

        public Mono<ActionExecutionResult> executeCommon(
                APIConnection apiConnection,
                DatasourceConfiguration datasourceConfiguration,
                ActionConfiguration actionConfiguration,
                List<Map.Entry<String, String>> insertedParams,
                ExecuteActionDTO executeActionDTO) {

            // Initializing object for error condition
            ActionExecutionResult errorResult = new ActionExecutionResult();
            initUtils.initializeResponseWithError(errorResult);

            Feature feature =
                    Feature.valueOf(RequestUtils.extractDataFromFormData(actionConfiguration.getFormData(), USECASE));
            AiFeatureService aiFeatureService = AiFeatureServiceFactory.getAiFeatureService(feature);
            Query query = aiFeatureService.createQuery(actionConfiguration, datasourceConfiguration);
            AiServerRequestDTO aiServerRequestDTO = new AiServerRequestDTO(feature, query);

            ActionExecutionResult actionExecutionResult = new ActionExecutionResult();
            ActionExecutionRequest actionExecutionRequest = RequestCaptureFilter.populateRequestFields(
                    actionConfiguration, RequestUtils.createQueryUri(), insertedParams, objectMapper);

            return aiServerService
                    .executeQuery(aiServerRequestDTO)
                    .map(response -> {
                        actionExecutionResult.setIsExecutionSuccess(true);
                        actionExecutionResult.setBody(response);
                        actionExecutionResult.setRequest(actionExecutionRequest);
                        return actionExecutionResult;
                    })
                    .onErrorResume(error -> {
                        errorResult.setIsExecutionSuccess(false);
                        log.error(
                                "An error has occurred while trying to run the AI server API query. Error: {}",
                                error.getMessage());
                        if (!(error instanceof AppsmithPluginException)) {
                            error = new AppsmithPluginException(
                                    AppsmithPluginError.PLUGIN_ERROR, error.getMessage(), error);
                        }
                        errorResult.setErrorInfo(error);
                        return Mono.just(errorResult);
                    });
        }

        @Override
        public Set<String> validateDatasource(DatasourceConfiguration datasourceConfiguration, boolean isEmbedded) {
            return Set.of();
        }
    }
}
