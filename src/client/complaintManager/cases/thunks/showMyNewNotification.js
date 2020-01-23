import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";

const showMyNewNotification = values => async dispatch => {
  try {
    dispatch(snackbarSuccess(`This is my new notification: ${values}`));
  } catch (error) {}
};

export default showMyNewNotification;
