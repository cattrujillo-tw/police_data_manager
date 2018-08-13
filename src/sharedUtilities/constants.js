const LOCAL_DEV_PORT = 3000;
const PORT = 1234;
// ----------------------------------------
//          Action Types
// ----------------------------------------
const INVALID_FILE_TYPE_DROPPED = "INVALID_FILE_TYPE_DROPPED";
const DUPLICATE_FILE_DROPPED = "DUPLICATE_FILE_DROPPED";
const DROPZONE_FILE_REMOVED = "DROPZONE_FILE_REMOVED";

const CASE_CREATED_SUCCESS = "CASE_CREATED_SUCCESS";
const ATTACHMENT_UPLOAD_SUCCEEDED = "ATTACHMENT_UPLOAD_SUCCEEDED";
const ATTACHMENT_UPLOAD_FAILED = "ATTACHMENT_UPLOAD_FAILED";
const INCIDENT_DETAILS_UPDATE_SUCCEEDED = "INCIDENT_DETAILS_UPDATE_SUCCEEDED";
const INCIDENT_DETAILS_UPDATE_FAILED = "INCIDENT_DETAILS_UPDATE_FAILED";
const ADDRESS_VALIDITY_UPDATED = "ADDRESS_VALIDITY_UPDATED";
const ADDRESS_MESSAGE_VISIBILITY_UPDATED = "ADDRESS_MESSAGE_VISIBILITY_UPDATED";
const ADDRESS_TO_CONFIRM_UPDATED = "ADDRESS_TO_CONFIRM_UPDATED";
const ADDRESS_DISPLAY_VALUE_UPDATED = "ADDRESS_DISPLAY_VALUE_UPDATED";
const GET_CASE_NOTES_SUCCEEDED = "GET_CASE_NOTES_SUCCEEDED";

const ADD_CASE_NOTE_FAILED = "ADD_CASE_NOTE_FAILED";
const ADD_CASE_NOTE_SUCCEEDED = "ADD_CASE_NOTE_SUCCEEDED";
const EDIT_CASE_NOTE_FAILED = "EDIT_CASE_NOTE_FAILED";
const EDIT_CASE_NOTE_SUCCEEDED = "EDIT_CASE_NOTE_SUCCEEDED";
const REMOVE_CASE_NOTE_SUCCEEDED = "REMOVE_CASE_NOTE_SUCCEEDED";
const REMOVE_CASE_NOTE_FAILED = "REMOVE_CASE_NOTE_FAILED";
const CASE_NOTE_DIALOG_OPENED = "CASE_NOTE_DIALOG_OPENED";
const CASE_NOTE_DIALOG_CLOSED = "CASE_NOTE_DIALOG_CLOSED";
const REMOVE_CASE_NOTE_DIALOG_OPENED = "REMOVE_CASE_NOTE_DIALOG_OPENED";
const REMOVE_CASE_NOTE_DIALOG_CLOSED = "REMOVE_CASE_NOTE_DIALOG_CLOSED";
const CIVILIAN_DIALOG_OPENED = "CIVILIAN_DIALOG_OPENED";
const CIVILIAN_CREATION_SUCCEEDED = "CIVILIAN_CREATION_SUCCEEDED";
const CIVILIAN_CREATION_FAILED = "CIVILIAN_CREATION_FAILED";
const UPDATE_ALLEGATION_DETAILS_SUCCEEDED =
  "UPDATE_ALLEGATION_DETAILS_SUCCEEDED";

const CREATE_CASE_DIALOG_OPENED = "CREATE_CASE_DIALOG_OPENED";
const CREATE_CASE_DIALOG_CLOSED = "CREATE_CASE_DIALOG_CLOSED";
const CASE_STATUS_UPDATE_DIALOG_OPENED = "CASE_STATUS_UPDATE_DIALOG_OPENED";
const CASE_STATUS_UPDATE_DIALOG_CLOSED = "CASE_STATUS_UPDATE_DIALOG_CLOSED";
const REMOVE_PERSON_DIALOG_OPENED = "REMOVE_PERSON_DIALOG_OPENED";
const REMOVE_PERSON_DIALOG_CLOSED = "REMOVE_PERSON_DIALOG_CLOSED";
const REMOVE_PERSON_FAILED = "REMOVE_PERSON_FAILED";
const REMOVE_PERSON_SUCCEEDED = "REMOVE_PERSON_SUCCEEDED";

const DOWNLOAD_FAILED = "DOWNLOAD_FAILED";

const GET_ALLEGATIONS_SUCCEEDED = "GET_ALLEGATIONS_SUCCEEDED";
const GET_ALLEGATIONS_FAILED = "GET_ALLEGATIONS_FAILED";
const ADD_OFFICER_ALLEGATION_SUCCEEDED = "ADD_OFFICER_ALLEGATION_SUCCEEDED";

const EXPORT_AUDIT_LOG_CONFIRMATION_OPENED =
  "EXPORT_AUDIT_LOG_CONFIRMATION_OPENED";
const EXPORT_ALL_CASES_CONFIRMATION_OPENED =
  "EXPORT_ALL_CASES_CONFIRMATION_OPENED";
const EXPORT_CONFIRMATION_CLOSED = "EXPORT_CONFIRMATION_CLOSED";

// ----------------------------------------
//          Attachment Errors
// ----------------------------------------
const FILE_TYPE_INVALID = "File type invalid";
const DUPLICATE_FILE_NAME = "Duplicate file name";
const UPLOAD_CANCELED = "Upload canceled.";

// ----------------------------------------
//          Attachment Removal
// ----------------------------------------

const REMOVE_ATTACHMENT_SUCCESS = "REMOVE_ATTACHMENT_SUCCESS";
const REMOVE_ATTACHMENT_FAILED = "REMOVE_ATTACHMENT_FAILED";

// ----------------------------------------
//          Snackbar Actions
// ----------------------------------------

const SNACKBAR_ERROR = "SNACKBAR_ERROR";
const SNACKBAR_SUCCESS = "SNACKBAR_SUCCESS";

// ----------------------------------------
//          Redux Forms
// ----------------------------------------

const CIVILIAN_FORM_NAME = "Civilian form";
const ALLEGATION_SEARCH_FORM_NAME = "AllegationSearchForm";

// ----------------------------------------
//          Auth0 Scopes / Permissions
// ----------------------------------------

const USER_PERMISSIONS = {
  EXPORT_AUDIT_LOG: "export:audit-log",
  CAN_REVIEW_CASE: "update:case-status"
};
const OPENID = "openid";
const PROFILE = "profile";

// ----------------------------------------
//          Shared Search
// ----------------------------------------

const SEARCH_INITIATED = "SEARCH_INITIATED";
const SEARCH_SUCCESS = "SEARCH_SUCCESS";
const SEARCH_FAILED = "SEARCH_FAILED";
const SEARCH_CLEARED = "SEARCH_CLEARED";

// ----------------------------------------
//          Officers
// ----------------------------------------

const ADD_OFFICER_TO_CASE_SUCCEEDED = "ADD_OFFICER_TO_CASE_SUCCEEDED";
const ADD_OFFICER_TO_CASE_FAILED = "ADD_OFFICER_TO_CASE_FAILED";
const OFFICER_SELECTED = "OFFICER_SELECTED";
const CASE_OFFICER_SELECTED = "CASE_OFFICER_SELECTED";
const UNKNOWN_OFFICER_SELECTED = "UNKNOWN_OFFICER_SELECTED";
const CLEAR_SELECTED_OFFICER = "CLEAR_SELECTED_OFFICER";
const EDIT_CASE_OFFICER_SUCCEEDED = "EDIT_CASE_OFFICER_SUCCEEDED";
const EDIT_CASE_OFFICER_FAILED = "EDIT_CASE_OFFICER_FAILED";

// ----------------------------------------
//          Case History Actions
// ----------------------------------------

const GET_CASE_HISTORY_SUCCESS = "GET_CASE_HISTORY_SUCCESS";

// ----------------------------------------
//          Case Status Actions
// ----------------------------------------

const UPDATE_CASE_STATUS_SUCCESS = "UPDATE_CASE_STATUS_SUCCESS";

// ----------------------------------------
//          Other
// ----------------------------------------

const TIMEZONE = "America/Chicago";
const UTF8_BYTE_ORDER_MARK = "\ufeff";

// ----------------------------------------
//          Audit
// ----------------------------------------
const AUDIT_TYPE = {
  DATA_CHANGE: "Data Change",
  EXPORT: "Export",
  AUTHENTICATION: "Log in/out",
  DATA_ACCESS: "Data Access"
};

const AUDIT_SUBJECT = {
  AUDIT_LOG: "Audit Log",
  CASE_DETAILS: "Case Details",
  ALL_CASES: "All Cases",
  ALL_CASE_INFORMATION: "All Case Information",
  OFFICER_DATA: "Officer Data",
  CASE_HISTORY: "Case History",
  CASE_NOTES: "Case Notes",
  ATTACHMENTS: "Attachments"
};

const AUDIT_ACTION = {
  DATA_UPDATED: "Updated",
  DATA_ACCESSED: "Accessed",
  DATA_CREATED: "Created",
  DATA_DELETED: "Deleted",
  LOGGED_IN: "Logged in",
  LOGGED_OUT: "Logged out",
  EXPORTED: "Exported",
  DOWNLOADED: "Downloaded"
};

const AUDIT_FIELDS_TO_EXCLUDE = "(.*Id$|^id$|addressableType)";
const AUDIT_SNAPSHOT_FIELDS_TO_EXCLUDE =
  "(createdAt|updatedAt|deletedAt|addressableType)";

// ----------------------------------------
//          Role on Case Options
// ----------------------------------------
const ACCUSED = "Accused";
const WITNESS = "Witness";
const COMPLAINANT = "Complainant";

// ----------------------------------------
//          Complaint Type Options
// ----------------------------------------
const CIVILIAN_INITIATED = "Civilian Initiated";
const RANK_INITIATED = "Rank Initiated";

// ----------------------------------------
//          Case Status Map
// ----------------------------------------
const CASE_STATUS = {
  INITIAL: "Initial",
  ACTIVE: "Active",
  READY_FOR_REVIEW: "Ready for Review",
  FORWARDED_TO_AGENCY: "Forwarded to Agency",
  CLOSED: "Closed"
};

const CASE_STATUS_MAP = {
  [CASE_STATUS.INITIAL]: 0,
  [CASE_STATUS.ACTIVE]: 1,
  [CASE_STATUS.READY_FOR_REVIEW]: 2,
  [CASE_STATUS.FORWARDED_TO_AGENCY]: 3,
  [CASE_STATUS.CLOSED]: 4
};

// ----------------------------------------
//          Pagination
// ----------------------------------------
const DEFAULT_PAGINATION_LIMIT = 20;

// ------------------------------------------
//           UI
const OFFICER_PANEL_DATA_CLEARED = "OFFICER_PANEL_DATA_CLEARED";
const ACCUSED_OFFICER_PANEL_COLLAPSED = "ACCUSED_OFFICER_PANEL_COLLAPSED";
const ACCUSED_OFFICER_PANEL_EXPANDED = "ACCUSED_OFFICER_PANEL_EXPANDED";
const EDIT_ALLEGATION_FORM_OPENED = "EDIT_ALLEGATION_FORM_OPENED";
const EDIT_ALLEGATION_FORM_CLOSED = "EDIT_ALLEGATION_FORM_CLOSED";
const EDIT_ALLEGATION_FORM_DATA_CLEARED = "EDIT_ALLEGATION_FORM_DATA_CLEARED";
const REMOVE_ALLEGATION_DIALOG_OPENED = "REMOVE_ALLEGATION_DIALOG_OPENED";
const REMOVE_ALLEGATION_DIALOG_CLOSED = "REMOVE_ALLEGATION_DIALOG_CLOSED";
const REMOVE_OFFICER_ALLEGATION_FAILED = "REMOVE_OFFICER_ALLEGATION_FAILED";
const REMOVE_OFFICER_ALLEGATION_SUCCEEDED =
  "REMOVE_OFFICER_ALLEGATION_SUCCEEDED";

// ------------------------------------------
//           Feature Toggles
// ------------------------------------------
const GET_FEATURES_SUCCEEDED = "GET_FEATURES_SUCCEEDED";

// ------------------------------------------
//           S3 operations
// ------------------------------------------
const S3_GET_OBJECT = "getObject";
const S3_URL_EXPIRATION = 60;

module.exports = {
  LOCAL_DEV_PORT,
  PORT,
  INVALID_FILE_TYPE_DROPPED,
  DUPLICATE_FILE_DROPPED,
  DROPZONE_FILE_REMOVED,
  CASE_CREATED_SUCCESS,
  ADD_CASE_NOTE_FAILED,
  ADD_CASE_NOTE_SUCCEEDED,
  EDIT_CASE_NOTE_FAILED,
  EDIT_CASE_NOTE_SUCCEEDED,
  REMOVE_CASE_NOTE_SUCCEEDED,
  REMOVE_CASE_NOTE_FAILED,
  CASE_NOTE_DIALOG_OPENED,
  CASE_NOTE_DIALOG_CLOSED,
  REMOVE_CASE_NOTE_DIALOG_OPENED,
  REMOVE_CASE_NOTE_DIALOG_CLOSED,
  CREATE_CASE_DIALOG_OPENED,
  CREATE_CASE_DIALOG_CLOSED,
  CIVILIAN_DIALOG_OPENED,
  CIVILIAN_CREATION_SUCCEEDED,
  CIVILIAN_CREATION_FAILED,
  DOWNLOAD_FAILED,
  ATTACHMENT_UPLOAD_SUCCEEDED,
  ATTACHMENT_UPLOAD_FAILED,
  INCIDENT_DETAILS_UPDATE_SUCCEEDED,
  INCIDENT_DETAILS_UPDATE_FAILED,
  ADDRESS_VALIDITY_UPDATED,
  ADDRESS_MESSAGE_VISIBILITY_UPDATED,
  ADDRESS_TO_CONFIRM_UPDATED,
  ADDRESS_DISPLAY_VALUE_UPDATED,
  GET_CASE_NOTES_SUCCEEDED,
  FILE_TYPE_INVALID,
  DUPLICATE_FILE_NAME,
  UPLOAD_CANCELED,
  REMOVE_ATTACHMENT_FAILED,
  REMOVE_ATTACHMENT_SUCCESS,
  SNACKBAR_ERROR,
  SNACKBAR_SUCCESS,
  CIVILIAN_FORM_NAME,
  ALLEGATION_SEARCH_FORM_NAME,
  USER_PERMISSIONS,
  SEARCH_SUCCESS,
  SEARCH_INITIATED,
  SEARCH_FAILED,
  SEARCH_CLEARED,
  ADD_OFFICER_TO_CASE_SUCCEEDED,
  ADD_OFFICER_TO_CASE_FAILED,
  OFFICER_SELECTED,
  CASE_OFFICER_SELECTED,
  UNKNOWN_OFFICER_SELECTED,
  CLEAR_SELECTED_OFFICER,
  EDIT_CASE_OFFICER_SUCCEEDED,
  EDIT_CASE_OFFICER_FAILED,
  GET_CASE_HISTORY_SUCCESS,
  UPDATE_CASE_STATUS_SUCCESS,
  CASE_STATUS_UPDATE_DIALOG_OPENED,
  CASE_STATUS_UPDATE_DIALOG_CLOSED,
  OPENID,
  PROFILE,
  TIMEZONE,
  REMOVE_PERSON_DIALOG_OPENED,
  REMOVE_PERSON_DIALOG_CLOSED,
  REMOVE_PERSON_FAILED,
  REMOVE_PERSON_SUCCEEDED,
  GET_ALLEGATIONS_SUCCEEDED,
  GET_ALLEGATIONS_FAILED,
  ADD_OFFICER_ALLEGATION_SUCCEEDED,
  ACCUSED,
  WITNESS,
  COMPLAINANT,
  CIVILIAN_INITIATED,
  RANK_INITIATED,
  CASE_STATUS,
  CASE_STATUS_MAP,
  ACCUSED_OFFICER_PANEL_COLLAPSED,
  ACCUSED_OFFICER_PANEL_EXPANDED,
  OFFICER_PANEL_DATA_CLEARED,
  DEFAULT_PAGINATION_LIMIT,
  UPDATE_ALLEGATION_DETAILS_SUCCEEDED,
  EDIT_ALLEGATION_FORM_OPENED,
  EDIT_ALLEGATION_FORM_CLOSED,
  EDIT_ALLEGATION_FORM_DATA_CLEARED,
  REMOVE_ALLEGATION_DIALOG_OPENED,
  REMOVE_ALLEGATION_DIALOG_CLOSED,
  REMOVE_OFFICER_ALLEGATION_FAILED,
  REMOVE_OFFICER_ALLEGATION_SUCCEEDED,
  AUDIT_TYPE,
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_FIELDS_TO_EXCLUDE,
  AUDIT_SNAPSHOT_FIELDS_TO_EXCLUDE,
  UTF8_BYTE_ORDER_MARK,
  EXPORT_AUDIT_LOG_CONFIRMATION_OPENED,
  EXPORT_CONFIRMATION_CLOSED,
  EXPORT_ALL_CASES_CONFIRMATION_OPENED,
  GET_FEATURES_SUCCEEDED,
  S3_GET_OBJECT,
  S3_URL_EXPIRATION
};
