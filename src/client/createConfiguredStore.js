import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { reducer as formReducer } from "redux-form";
import thunk from "redux-thunk";
import history from "./history";
import { routerMiddleware, connectRouter } from "connected-react-router";
import allCasesReducer from "./reducers/cases/allCasesReducer";
import snackbarReducer from "./reducers/ui/snackbarReducer";
import caseDetailsReducer from "./reducers/cases/caseDetailsReducer";
import caseHistoryReducer from "./reducers/cases/caseHistoryReducer";
import casesTableReducer from "./reducers/ui/casesTableReducer";
import civilianDialogReducer from "./reducers/ui/civilianDialogReducer";
import userInfoReducer from "./auth/reducers/userInfoReducer";
import attachmentsReducer from "./reducers/ui/attachmentsReducer";
import searchOfficersReducer from "./reducers/officers/searchOfficersReducer";
import caseNotesReducer from "./reducers/cases/caseNotesReducer";
import caseNoteDialogReducer from "./reducers/ui/caseNoteDialogReducer";
import removePersonDialogReducer from "./reducers/ui/removePersonDialogReducer";
import removeCaseNoteDialogReducer from "./reducers/ui/removeCaseNoteDialogReducer";
import searchReducer from "./reducers/ui/searchReducer";
import allegationMenuDisplay from "./reducers/ui/allegationMenuDisplay";
import createCaseDialogReducer from "./reducers/ui/createCaseDialogReducer";
import updateCaseStatusDialogReducer from "./reducers/ui/updateCaseStatusDialogReducer";
import accusedOfficerPanelsReducer from "./reducers/ui/accusedOfficerPanelsReducer";
import editAllegationFormsReducer from "./reducers/ui/editAllegationFormsReducer";
import removeOfficerAllegationDialogReducer from "./reducers/ui/removeOfficerAllegationDialogReducer";
import exportDialogReducer from "./reducers/ui/exportDialogReducer";
import featureTogglesReducer from "./reducers/featureToggles/featureTogglesReducer";
import addressInputReducer from "./reducers/ui/addressInputReducer";
import classificationReducer from "./reducers/ui/classificationReducer";
import officerHistoryNoteDialogReducer from "./reducers/ui/officerHistoryNoteDialogReducer";
import referralLetterReducer from "./reducers/cases/referralLetterReducer";
import exportJobDownloadUrlReducer from "./reducers/export/exportJobDownloadUrlReducer";
import generateJobReducer from "./reducers/export/generateJobReducer";
import iaProCorrectionsReducer from "./reducers/ui/iaProCorrectionDialogReducer";
import allExportsReducer from "./reducers/ui/allExportsReducer";
import recommendedActionsReducer from "./reducers/cases/recommendedActionsReducer";
import editReferralLetterReducer from "./reducers/ui/editReferralLetterReducer";
import cancelEditLetterConfirmationDialogReducer from "./reducers/ui/cancelEditlLetterConfirmationDialogReducer";
import letterDownloadReducer from "./reducers/ui/letterDownloadReducer";
import caseValidationDialogReducer from "./reducers/ui/caseValidationDialogReducer";
import loadPdfPreviewReducer from "./reducers/ui/loadPdfPreviewReducer";
import intakeSourceReducer from "./reducers/ui/intakeSourceReducer";

const rootReducer = combineReducers({
  form: formReducer,
  router: connectRouter(history),
  cases: combineReducers({
    all: allCasesReducer
  }),
  currentCase: combineReducers({
    details: caseDetailsReducer,
    caseNotes: caseNotesReducer,
    caseHistory: caseHistoryReducer
  }),
  referralLetter: referralLetterReducer,
  recommendedActions: recommendedActionsReducer,
  users: combineReducers({
    current: userInfoReducer
  }),
  ui: combineReducers({
    snackbar: snackbarReducer,
    casesTable: casesTableReducer,
    updateCaseStatusDialog: updateCaseStatusDialogReducer,
    caseNoteDialog: caseNoteDialogReducer,
    civilianDialog: civilianDialogReducer,
    createCaseDialog: createCaseDialogReducer,
    exportDialog: exportDialogReducer,
    allExports: allExportsReducer,
    removePersonDialog: removePersonDialogReducer,
    removeCaseNoteDialog: removeCaseNoteDialogReducer,
    editLetterConfirmationDialog: editReferralLetterReducer,
    cancelEditLetterConfirmationDialog: cancelEditLetterConfirmationDialogReducer,
    attachments: attachmentsReducer,
    search: searchReducer,
    allegations: allegationMenuDisplay,
    classifications: classificationReducer,
    intakeSources: intakeSourceReducer,
    editAllegationForms: editAllegationFormsReducer,
    removeOfficerAllegationDialog: removeOfficerAllegationDialogReducer,
    accusedOfficerPanels: accusedOfficerPanelsReducer,
    addressInput: addressInputReducer,
    officerHistoryNoteDialog: officerHistoryNoteDialogReducer,
    iaProCorrectionsDialog: iaProCorrectionsReducer,
    letterDownload: letterDownloadReducer,
    pdfPreview: loadPdfPreviewReducer,
    caseValidationDialog: caseValidationDialogReducer
  }),
  officers: searchOfficersReducer,
  featureToggles: featureTogglesReducer,
  export: combineReducers({
    downloadUrl: exportJobDownloadUrlReducer,
    generateJob: generateJobReducer
  })
});

const routingMiddleware = routerMiddleware(history);

const createConfiguredStore = () =>
  createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk, routingMiddleware))
  );

export default createConfiguredStore;
