import {applyMiddleware, combineReducers, createStore} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import {reducer as formReducer} from 'redux-form'
import thunk from 'redux-thunk'
import history from './history'
import {routerMiddleware, routerReducer} from 'react-router-redux'
import allCasesReducer from './reducers/cases/allCasesReducer'
import allUsersReducer from "./reducers/users/allUsersReducer";
import snackbarReducer from "./reducers/ui/snackbarReducer";
import caseDetailsReducer from "./reducers/cases/caseDetailsReducer";
import casesTableReducer from "./reducers/ui/casesTableReducer";
import civilianDialogReducer from "./reducers/ui/civilianDialogReducer";
import userInfoReducer from "./auth/reducers/userInfoReducer";
import attachmentsReducer from "./reducers/ui/attachmentsReducer";
import searchOfficersReducer from "./reducers/officers/searchOfficersReducer";
import incidentDetailsDialogReducer from "./reducers/ui/incidentDetailsDialogReducer";
import recentActivityReducer from "./reducers/cases/recentActivityReducer";
import userActionDialogReducer from "./reducers/ui/userActionDialogReducer";
import removeCivilianDialogReducer from "./reducers/ui/removeCivilianDialogReducer";
import removeUserActionDialogReducer from "./reducers/ui/removeUserActionDialogReducer";

const rootReducer = combineReducers({
    form: formReducer,
    routing: routerReducer,
    cases: combineReducers({
        all: allCasesReducer
    }),
    currentCase: combineReducers({
        details: caseDetailsReducer,
        recentActivity: recentActivityReducer
    }),
    users: combineReducers({
        all: allUsersReducer,
        current: userInfoReducer

    }),
    ui: combineReducers({
        snackbar: snackbarReducer,
        casesTable: casesTableReducer,
        userActionDialog: userActionDialogReducer,
        civilianDialog: civilianDialogReducer,
        removeCivilianDialog: removeCivilianDialogReducer,
        removeUserActionDialog: removeUserActionDialogReducer,
        incidentDetailsDialog: incidentDetailsDialogReducer,
        attachments: attachmentsReducer
    }),
    officers: searchOfficersReducer
})

const routingMiddleware = routerMiddleware(history)

const createConfiguredStore = () => createStore(rootReducer, composeWithDevTools(
    applyMiddleware(
        thunk,
        routingMiddleware
    )
))

export default createConfiguredStore
