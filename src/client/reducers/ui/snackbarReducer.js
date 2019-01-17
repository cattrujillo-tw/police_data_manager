import {
  ATTACHMENT_UPLOAD_FAILED,
  ATTACHMENT_UPLOAD_SUCCEEDED,
  DOWNLOAD_FAILED,
  SNACKBAR_ERROR,
  SNACKBAR_SUCCESS
} from "../../../sharedUtilities/constants";

//TODO Discuss separation of concerns.
// Refactoring 1:  Use 1 global snackbar, don't worry about collisions.  Have thunk dispatch generic success/failure/pending with parameterized messages.  Puts presentation logic in thunk.  wah wah
/*    case 'REQUESTED':
            return {
                open: false,
                success: false,
                message: <parameterized>
            }
        case 'SUCCESS':
            return {
                open: true,
                success: true,
                message: <parameterized>
            }
        case 'SERVER_ERROR':
            return {
                open: true,
                success: false,
                message: <parameterized>
            }
        default:
            return state
*/
// Refactoring 2:  Instantiate different snackbars for each type of business event so that one success event can't dismiss another failure's red snackbar.

const initialState = { open: false, success: false, message: "" };
const snackbarReducer = (state = initialState, action) => {
  switch (action.type) {
    case SNACKBAR_ERROR:
      return {
        open: true,
        success: false,
        message: action.message
      };
    case SNACKBAR_SUCCESS:
      return {
        open: true,
        success: true,
        message: action.message
      };
    case "CLOSE_SNACKBAR":
      return {
        open: false,
        success: state.success,
        message: state.message
      };
    case "USER_CREATION_REQUESTED":
      return {
        open: false,
        success: false,
        message: ""
      };
    case "USER_CREATED_SUCCESS":
      return {
        open: true,
        success: true,
        message: "User was successfully created."
      };
    case "USER_CREATION_FAILED":
      return {
        open: true,
        success: false,
        message:
          "Something went wrong and the user was not created. Please try again."
      };
    case "CASE_CREATION_REQUESTED":
      return {
        open: false,
        success: false,
        message: ""
      };
    case ATTACHMENT_UPLOAD_SUCCEEDED:
      return {
        open: true,
        success: true,
        message: "File was successfully attached"
      };
    case ATTACHMENT_UPLOAD_FAILED:
      return {
        open: true,
        success: false,
        message:
          "Something went wrong and the file was not attached. Please try again."
      };
    case DOWNLOAD_FAILED:
      return {
        open: true,
        success: false,
        message:
          "Something went wrong and the file was not downloaded. Please try again."
      };
    default:
      return state;
  }
};
export default snackbarReducer;
