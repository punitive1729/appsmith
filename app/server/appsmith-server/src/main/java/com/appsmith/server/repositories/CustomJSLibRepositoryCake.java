package com.appsmith.server.repositories;

import com.appsmith.server.acl.AclPermission;
import com.appsmith.server.domains.*;
import com.appsmith.server.dtos.*;
import com.appsmith.server.projections.*;
import com.appsmith.external.models.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.data.domain.Sort;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import org.springframework.data.mongodb.core.query.*;
import com.mongodb.bulk.BulkWriteResult;
import com.mongodb.client.result.InsertManyResult;
import com.querydsl.core.types.dsl.StringPath;


import java.util.*;

@Component
@RequiredArgsConstructor
public class CustomJSLibRepositoryCake {
    private final CustomJSLibRepository repository;

    // From CrudRepository
    public Mono<CustomJSLib> save(CustomJSLib entity) {
        return Mono.defer(() -> Mono.justOrEmpty(repository.save(entity)));
    }
    public Flux<CustomJSLib> saveAll(Iterable<CustomJSLib> entities) {
        return Flux.defer(() -> Flux.fromIterable(repository.saveAll(entities)));
    }
    public Mono<CustomJSLib> findById(String id) {
        return Mono.defer(() -> Mono.justOrEmpty(repository.findById(id)));
    }
    // End from CrudRepository

    public boolean archiveById(String id) {
        return repository.archiveById(id);
    }

    public Flux<CustomJSLib> findCustomJsLibsInContext(Set<CustomJSLibContextDTO> customJSLibContextDTOS) {
        return Flux.defer(() -> Flux.fromIterable(repository.findCustomJsLibsInContext(customJSLibContextDTOS)));
    }

    public Mono<CustomJSLib> updateAndReturn(String id, Update updateObj, Optional<AclPermission> permission) {
        return Mono.defer(() -> Mono.justOrEmpty(repository.updateAndReturn(id, updateObj, permission)));
    }

    public Flux<CustomJSLib> queryAll(List<Criteria> criterias, AclPermission permission) {
        return Flux.defer(() -> Flux.fromIterable(repository.queryAll(criterias, permission)));
    }

    public Mono<Boolean> archiveAllById(java.util.Collection<String> ids) {
        return Mono.defer(() -> Mono.justOrEmpty(repository.archiveAllById(ids)));
    }

    public Mono<CustomJSLib> retrieveById(String id) {
        return Mono.defer(() -> Mono.justOrEmpty(repository.retrieveById(id)));
    }

    public Flux<CustomJSLib> queryAll(List<Criteria> criterias, AclPermission permission, Sort sort) {
        return Flux.defer(() -> Flux.fromIterable(repository.queryAll(criterias, permission, sort)));
    }

    public Flux<CustomJSLib> queryAll(List<Criteria> criterias, List<String> includeFields, AclPermission permission, Sort sort) {
        return Flux.defer(() -> Flux.fromIterable(repository.queryAll(criterias, includeFields, permission, sort)));
    }

    public Mono<CustomJSLib> setUserPermissionsInObject(CustomJSLib obj) {
        return Mono.defer(() -> Mono.justOrEmpty(repository.setUserPermissionsInObject(obj)));
    }

    public Mono<CustomJSLib> findUniqueCustomJsLib(CustomJSLib customJSLib) {
        return Mono.defer(() -> Mono.justOrEmpty(repository.findUniqueCustomJsLib(customJSLib)));
    }

    public Mono<CustomJSLib> setUserPermissionsInObject(CustomJSLib obj, Set<String> permissionGroups) {
        return Mono.defer(() -> Mono.justOrEmpty(repository.setUserPermissionsInObject(obj, permissionGroups)));
    }

    public Mono<CustomJSLib> findById(String id, AclPermission permission) {
        return Mono.defer(() -> Mono.justOrEmpty(repository.findById(id, permission)));
    }

    public Mono<CustomJSLib> archive(CustomJSLib entity) {
        return Mono.defer(() -> Mono.justOrEmpty(repository.archive(entity)));
    }

}
