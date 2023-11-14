export * from "ce/utils/analyticsUtilTypes";
import type { EventName as CE_EventName } from "ce/utils/analyticsUtilTypes";

export type EventName =
  | CE_EventName
  | GAC_EVENT_NAMES
  | AUDIT_LOGS_EVENT_NAMES
  | AI_EVENTS
  | SCIM_EVENTS
  | AI_KB_EVENTS
  | MODULES_EVENTS
  | ENV_WALKTHROUGH_EVENTS;

export type GAC_EVENT_NAMES =
  | "GAC_USER_CLICK"
  | "GAC_USER_ROLE_UPDATE"
  | "GAC_USER_GROUP_UPDATE"
  | "GAC_GROUP_ROLE_UPDATE"
  | "GAC_INVITE_USER_CLICK"
  | "GAC_ADD_USER_CLICK";

export type AUDIT_LOGS_EVENT_NAMES =
  | "AUDIT_LOGS_CLEAR_FILTERS"
  | "AUDIT_LOGS_FILTER_BY_RESOURCE_ID"
  | "AUDIT_LOGS_FILTER_BY_EMAIL"
  | "AUDIT_LOGS_FILTER_BY_EVENT"
  | "AUDIT_LOGS_FILTER_BY_DATE"
  | "AUDIT_LOGS_COLLAPSIBLE_ROW_OPENED"
  | "AUDIT_LOGS_COLLAPSIBLE_ROW_CLOSED";

export type AI_EVENTS =
  | "AI_QUERY_SENT"
  | "AI_RESPONSE_GENERATED"
  | "AI_RESPONSE_COPIED"
  | "AI_RESPONSE_EXECUTION_FAILED"
  | "AI_RESPONSE_FEEDBACK"
  | "AI_RESPONSE_EXECUTION_INIT"
  | "AI_PROMPT_CLICKED"
  | "AI_PROMPT_SHOWN"
  | "AI_SIGNPOSTING_SHOWN"
  | "AI_ASK_AI_BUTTON_SHOWN"
  | "AI_ASK_AI_BUTTON_CLICK";

export type AI_KB_EVENTS =
  | "AI_RESPONSE_EXECUTION_INIT"
  | "AI_KB_MENU_CLICK"
  | "AI_KB_GENERATE_CLICK"
  | "AI_KB_REGENERATE_CLICK"
  | "AI_KB_PREVIEW"
  | "AI_KB_FEEDBACK";

export type SCIM_EVENTS =
  | "SCIM_CONFIGURE_CLICKED"
  | "SCIM_GENERATE_KEY_CLICKED"
  | "SCIM_RECONFIGURE_KEY_CLICKED"
  | "SCIM_RECONFIGURE_KEY_CONFIRMED"
  | "SCIM_DISABLE_CLICKED"
  | "SCIM_DISABLE_CONFIRMED"
  | "SCIM_PROVISIONED_USERS_CLICKED"
  | "SCIM_PROVISIONED_GROUPS_CLICKED";

export type MODULES_EVENTS = "ENTITY_EXPLORER_ADD_MODULE_CLICK";

export type ENV_WALKTHROUGH_EVENTS = "ENV_WALKTHROUGH_NEXT_CLICKED";
