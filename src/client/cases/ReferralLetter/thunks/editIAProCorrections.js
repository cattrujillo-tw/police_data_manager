import getAccessToken from "../../../auth/getAccessToken";
import { push } from "react-router-redux";
import config from "../../../config/config";
import axios from "axios/index";
import { editIAProCorrectionsSuccess } from "../../../actionCreators/letterActionCreators";
import {
  snackbarError,
  snackbarSuccess
} from "../../../actionCreators/snackBarActionCreators";

const editIAProCorrections = (
  caseId,
  iaProCorrectionValues,
  successRedirectRoute
) => async dispatch => {
  const token = getAccessToken();
  if (!token) {
    return dispatch(push("/login"));
  }
  try {
    const hostname = config[process.env.NODE_ENV].hostname;
    const response = await axios(
      `${hostname}/api/cases/${caseId}/referral-letter/iapro-corrections`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        data: iaProCorrectionValues
      }
    );
    dispatch(editIAProCorrectionsSuccess(response.data));
    dispatch(snackbarSuccess("IAPro corrections were successfully updated"));
    return dispatch(push(successRedirectRoute));
  } catch (error) {
    if (error.response.data.message === "Invalid case status") {
      return dispatch(push(`/cases/${caseId}`));
    }
    dispatch(
      snackbarError(
        "Something went wrong and the IAPro corrections were not updated. Please try again."
      )
    );
  }
};

export default editIAProCorrections;
