import {
  EXPORT_AUDIT_LOG_CONFIRMATION_OPENED,
  EXPORT_CONFIRMATION_CLOSED,
  EXPORT_ALL_CASES_CONFIRMATION_OPENED,
  JOB_OPERATION
} from "../../../sharedUtilities/constants";

const initialState = {
  open: false,
  path: "",
  title: "",
  warningText: ""
};

const exportDialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case EXPORT_AUDIT_LOG_CONFIRMATION_OPENED:
      return {
        open: true,
        path: `/api/export/schedule/${JOB_OPERATION.AUDIT_LOG_EXPORT.name}`,
        title: "Audit Log",
        warningText: "a log of all actions taken within"
      };
    case EXPORT_ALL_CASES_CONFIRMATION_OPENED:
      return {
        open: true,
        path: `/api/export/schedule/${JOB_OPERATION.CASE_EXPORT.name}`,
        title: "All Case Information",
        warningText: "all cases in"
      };
    case EXPORT_CONFIRMATION_CLOSED:
      return {
        ...state,
        open: false
      };
    default:
      return state;
  }
};

export default exportDialogReducer;
