import axios from "axios";
import { getUsersSuccess } from "../actionCreators/usersActionCreators";
import { snackbarError } from "../../policeDataManager/actionCreators/snackBarActionCreators";
import { INTERNAL_ERRORS } from "../../../sharedUtilities/errorMessageConstants";

const getUsers = () => async dispatch => {
  try {
    const response = await axios.get("/api/users");
    return dispatch(getUsersSuccess(response.data));
  } catch (error) {
    console.error(error);
    return dispatch(
      snackbarError(INTERNAL_ERRORS.USER_MANAGEMENT_API_GET_USERS_FAILURE)
    );
  }
};

export default getUsers;
