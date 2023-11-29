package com.appsmith.server.searchentities;

import com.appsmith.server.constants.FieldName;
import com.appsmith.server.domains.Application;
import com.appsmith.server.domains.Workspace;
import com.appsmith.server.dtos.SearchEntityDTO;
import com.appsmith.server.services.ApplicationService;
import com.appsmith.server.services.WorkspaceService;
import com.appsmith.server.solutions.ApplicationPermission;
import com.appsmith.server.solutions.WorkspacePermission;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
public class SearchEntitySolutionCEImpl implements SearchEntitySolutionCE {

    private final WorkspaceService workspaceService;

    private final ApplicationService applicationService;

    private final WorkspacePermission workspacePermission;

    private final ApplicationPermission applicationPermission;

    /**
     * This method searches for workspaces and applications based on the searchString provided.
     * The search is performed on the name field of the entities and is case-insensitive.
     * The search results are sorted by the updated_at field in descending order.
     * @param entities      The list of entities to search for. If null or empty, all entities are searched.
     * @param searchString  The string to search for in the name field of the entities.
     * @param page          The page number of the results to return.
     * @param size          Max number of results to return within each entity.
     * @return              A Mono of SearchEntityDTO containing the list of workspaces and applications.
     */
    @Override
    public Mono<SearchEntityDTO> searchEntity(String[] entities, String searchString, int page, int size) {
        if (size == 0) {
            return Mono.just(new SearchEntityDTO());
        }
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        Sort sort = Sort.by(Sort.Direction.DESC, FieldName.UPDATED_AT);

        // If no entities are specified, search for all entities.
        Mono<List<Workspace>> workspacesMono = Mono.just(new ArrayList<>());
        if (shouldSearchEntity(Workspace.class, entities)) {
            workspacesMono = workspaceService
                    .filterByFields(
                            List.of(FieldName.NAME),
                            searchString,
                            pageable,
                            sort,
                            workspacePermission.getReadPermission())
                    .collectList();
        }

        Mono<List<Application>> applicationsMono = Mono.just(new ArrayList<>());
        if (shouldSearchEntity(Application.class, entities)) {
            applicationsMono = applicationService
                    .filterByFields(
                            List.of(FieldName.NAME),
                            searchString,
                            pageable,
                            sort,
                            applicationPermission.getReadPermission())
                    .collectList();
        }

        return Mono.zip(workspacesMono, applicationsMono).map(tuple2 -> {
            SearchEntityDTO searchEntityDTO = new SearchEntityDTO();
            searchEntityDTO.setWorkspaces(tuple2.getT1());
            searchEntityDTO.setApplications(tuple2.getT2());
            return searchEntityDTO;
        });
    }

    @Override
    public boolean shouldSearchEntity(Class<?> entity, String[] entities) {
        if (entities == null || entities.length == 0) {
            return true;
        }
        for (String entityToSearch : entities) {
            if (entityToSearch.equalsIgnoreCase(entity.getSimpleName())) {
                return true;
            }
        }
        return false;
    }
}
