import getAccessToken from "../../../auth/getAccessToken";
import { push } from "react-router-redux";
import config from "../../../config/config";
import {
  snackbarError,
  snackbarSuccess
} from "../../../actionCreators/snackBarActionCreators";
import axios from "axios/index";

const editRecommendedActions = (
  caseId,
  recommendedActionValues,
  successRedirectRoute
) => async dispatch => {
  const token = getAccessToken();
  if (!token) {
    return dispatch(push("/login"));
  }
  try {
    const hostname = config[process.env.NODE_ENV].hostname;
    await axios(
      `${hostname}/api/cases/${caseId}/referral-letter/recommended-actions`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        data: recommendedActionValues
      }
    );
    dispatch(snackbarSuccess("Recommended actions were successfully updated"));
    return dispatch(push(successRedirectRoute));
  } catch (error) {
    if (
      error.response &&
      error.response.data.message === "Invalid case status"
    ) {
      return dispatch(push(`/cases/${caseId}`));
    }
    dispatch(
      snackbarError(
        "Something went wrong and we could not update the recommended actions information"
      )
    );
  }
};

export default editRecommendedActions;
