import {
  ADD_CASE_NOTE_SUCCEEDED,
  ADD_OFFICER_ALLEGATION_SUCCEEDED,
  ADD_OFFICER_TO_CASE_SUCCEEDED,
  ATTACHMENT_UPLOAD_SUCCEEDED,
  CIVILIAN_CREATION_SUCCEEDED,
  EDIT_CIVILIAN_SUCCESS,
  GET_CASE_DETAILS_SUCCESS,
  GET_MINIMUM_CASE_DETAILS_SUCCESS,
  INCIDENT_DETAILS_UPDATE_SUCCEEDED,
  NARRATIVE_UPDATE_SUCCEEDED,
  REMOVE_ATTACHMENT_SUCCESS,
  REMOVE_CASE_NOTE_SUCCEEDED,
  REMOVE_OFFICER_ALLEGATION_SUCCEEDED,
  REMOVE_PERSON_SUCCEEDED,
  UPDATE_ALLEGATION_DETAILS_SUCCEEDED,
  UPDATE_CASE_STATUS_SUCCESS
} from "../../../sharedUtilities/constants";

const initialState = {};

const caseDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CASE_DETAILS_SUCCESS:
    case NARRATIVE_UPDATE_SUCCEEDED:
    case ATTACHMENT_UPLOAD_SUCCEEDED:
    case INCIDENT_DETAILS_UPDATE_SUCCEEDED:
    case REMOVE_ATTACHMENT_SUCCESS:
    case REMOVE_PERSON_SUCCEEDED:
    case ADD_OFFICER_TO_CASE_SUCCEEDED:
    case REMOVE_CASE_NOTE_SUCCEEDED:
    case UPDATE_CASE_STATUS_SUCCESS:
    case EDIT_CIVILIAN_SUCCESS:
    case CIVILIAN_CREATION_SUCCEEDED:
    case UPDATE_ALLEGATION_DETAILS_SUCCEEDED:
    case ADD_OFFICER_ALLEGATION_SUCCEEDED:
    case REMOVE_OFFICER_ALLEGATION_SUCCEEDED:
    case GET_MINIMUM_CASE_DETAILS_SUCCESS:
    case ADD_CASE_NOTE_SUCCEEDED:
      return action.caseDetails;
    default:
      return state;
  }
};

export default caseDetailsReducer;
