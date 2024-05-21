create unique index if not exists u_name on config(name);
create unique index if not exists u_email on password_reset_token(email);
create unique index if not exists u_email on "user"(email);
create unique index if not exists u_name on sequence(name);
create unique index if not exists u_email on password_reset_token(email);
create unique index if not exists plugin_name_package_name_version_index on plugin(plugin_name, package_name, version);
create unique index if not exists u_user_id on user_data(user_id);
create unique index if not exists u_workspace_datasource_deleted on datasource(workspace_id, name, deleted_at);
create unique index if not exists u_workspace_app_deleted_git_application_metadata on application(workspace_id, name, deleted_at, (git_application_metadata ->> 'remoteUrl'), (git_application_metadata ->>'branchName'));
create unique index if not exists u_dsConfigStructure_dsId_envId on datasource_storage_structure(datasource_id, environment_id);
create unique index if not exists u_applicationId_chunkOrder on application_snapshot(application_id, chunk_order);