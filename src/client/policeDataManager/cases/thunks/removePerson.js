import {
  closeRemovePersonDialog,
  removePersonSuccess
} from "../../actionCreators/casesActionCreators";
import axios from "axios";
import { startSubmit, stopSubmit } from "redux-form";
import {
  OFFICER_TITLE,
  REMOVE_PERSON_FORM_NAME
} from "../../../../sharedUtilities/constants";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import _ from "lodash";

const {
  CIVILIAN_WITHIN_PD_TITLE,
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

const removePerson = personDetails => async dispatch => {
  const { personType, id, caseId } = personDetails;
  let personTypeForDisplay;
  if (personType === "civilians") {
    personTypeForDisplay = "Civilian";
  } else {
    const isCivilianWithinPd =
      personDetails.caseEmployeeType ===
      PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription;
    personTypeForDisplay = isCivilianWithinPd
      ? CIVILIAN_WITHIN_PD_TITLE
      : OFFICER_TITLE;
  }

  try {
    dispatch(startSubmit(REMOVE_PERSON_FORM_NAME));
    const response = await axios.delete(
      `api/cases/${caseId}/${personType}/${id}`
    );
    dispatch(closeRemovePersonDialog());
    dispatch(
      snackbarSuccess(`${personTypeForDisplay} was successfully removed`)
    );
    const event = await dispatch(
      removePersonSuccess(response.data, _.lowerFirst(personTypeForDisplay))
    );
    dispatch(stopSubmit(REMOVE_PERSON_FORM_NAME));
    return event;
  } catch (error) {
    dispatch(stopSubmit(REMOVE_PERSON_FORM_NAME));
  }
};

export default removePerson;
