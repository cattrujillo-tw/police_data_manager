import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import NavBar from "../../shared/components/NavBar/NavBar";
import { connect } from "react-redux";
import Narrative from "./Narrative";
import Complainants from "./ComplainantWitnesses/Complainants";
import CivilianDialog from "./CivilianDialog/CivilianDialog";
import getCaseDetails from "../thunks/getCaseDetails";
import * as _ from "lodash";
import Attachments from "./Attachments/Attachments";
import styles from "./caseDetailsStyles";
import CaseDrawer from "./CaseDrawer";
import IncidentDetails from "./IncidentDetails/IncidentDetails";
import {
  closeArchiveCaseDialog,
  closeCaseNoteDialog,
  closeCaseStatusUpdateDialog,
  closeEditCivilianDialog,
  closeEditIncidentDetailsDialog,
  closeRemoveAttachmentConfirmationDialog,
  closeRemoveCaseNoteDialog,
  closeRemovePersonDialog,
  closeRestoreArchivedCaseDialog
} from "../../actionCreators/casesActionCreators";
import {
  CASE_STATUS,
  NARRATIVE_FORM
} from "../../../../sharedUtilities/constants";
import Accused from "./Officers/Accused";
import CaseNoteDialog from "./CaseNoteDialog/CaseNoteDialog";
import RemoveCivilianDialog from "../RemovePersonDialog/RemovePersonDialog";
import { clearOfficerPanelData } from "../../actionCreators/accusedOfficerPanelsActionCreators";
import Witnesses from "./ComplainantWitnesses/Witnesses";
import CaseStatusStepper from "./CaseStatusStepper/CaseStatusStepper";
import LetterStatusMessage, {
  PAGE_TYPE
} from "./LetterStatusMessage/LetterStatusMessage";
import getReferralLetterEditStatus from "../ReferralLetter/thunks/getReferralLetterEditStatus";
import { scrollToTop } from "../../../ScrollToTop";
import { reset } from "redux-form";
import { complaintManagerMenuOptions } from "../../shared/components/NavBar/complaintManagerMenuOptions";

const drawerWidthPercentage = "30%";

const appBar = {
  position: "absolute",
  marginLeft: drawerWidthPercentage,
  width: `calc(100% - ${drawerWidthPercentage})`
};

export const resetCaseDetailsPage = dispatch => {
  dispatch(reset(NARRATIVE_FORM));
  dispatch(clearOfficerPanelData());
  dispatch(closeEditCivilianDialog());
  dispatch(closeCaseNoteDialog());
  dispatch(closeCaseStatusUpdateDialog());
  dispatch(closeRemoveCaseNoteDialog());
  dispatch(closeRemovePersonDialog());
  dispatch(closeEditIncidentDetailsDialog());
  dispatch(closeRestoreArchivedCaseDialog());
  dispatch(closeArchiveCaseDialog());
  dispatch(closeRemoveAttachmentConfirmationDialog());
};
class CaseDetails extends React.Component {
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      !prevProps.caseDetails.isArchived &&
      this.props.caseDetails.isArchived
    ) {
      scrollToTop();
    }
  }

  state = {
    mobileOpen: false,
    anchorEl: null,
    complainantMenuOpen: false,
    witnessMenuOpen: false,
    addAccusedMenuOpen: false
  };

  handleComplainantMenuOpen = event => {
    this.setState({ complainantMenuOpen: true, anchorEl: event.currentTarget });
  };

  handleComplainantMenuClose = () => {
    this.setState({ complainantMenuOpen: false });
  };

  handleWitnessMenuOpen = event => {
    this.setState({ witnessMenuOpen: true, anchorEl: event.currentTarget });
  };

  handleWitnessMenuClose = () => {
    this.setState({ witnessMenuOpen: false });
  };

  handleAddAccusedMenuOpen = event => {
    this.setState({ addAccusedMenuOpen: true, anchorEl: event.currentTarget });
  };

  handleAddAccusedMenuClose = () => {
    this.setState({ addAccusedMenuOpen: false });
  };

  componentDidMount() {
    const caseId = this.props.match.params.id;
    this.props.dispatch(getCaseDetails(caseId));
    this.props.dispatch(getReferralLetterEditStatus(caseId));
  }

  componentWillUnmount() {
    resetCaseDetailsPage(this.props.dispatch);
  }

  caseDetailsNotYetLoaded() {
    return (
      _.isEmpty(this.props.caseDetails) ||
      `${this.props.caseDetails.id}` !== this.props.match.params.id
    );
  }

  render() {
    if (this.caseDetailsNotYetLoaded()) {
      return null;
    }

    const statusIsClosed = this.props.caseDetails.status === CASE_STATUS.CLOSED;
    const status = this.props.caseDetails.status;

    const { classes } = this.props;

    return (
      <div className={classes.root} data-test="case-details-page">
        <div className={classes.appFrame}>
          <NavBar
            menuType={complaintManagerMenuOptions}
            showHome={false}
            customStyle={appBar}
          >
            <div className={classes.caseReference}>
              {`Case #${this.props.caseDetails.caseReference}`}
            </div>
            <Typography
              data-test="caseStatusBox"
              variant="caption"
              color="inherit"
              className={`${classes.statusBox} ${
                statusIsClosed
                  ? classes.closedStatusBox
                  : classes.activeStatusBox
              }`}
            >
              {status}
            </Typography>
          </NavBar>
          <CaseDrawer
            classes={classes}
            caseDetails={this.props.caseDetails}
            caseTaggingFeature={this.props.caseTaggingFeature}
          />
          <main className={classes.content}>
            <CaseStatusStepper />
            <div style={{ marginLeft: "5%", marginRight: "5%" }}>
              <LetterStatusMessage pageType={PAGE_TYPE.CASE_DETAILS} />
            </div>
            <IncidentDetails classes={classes} />
            <Complainants
              caseDetails={this.props.caseDetails}
              dispatch={this.props.dispatch}
              handleMenuOpen={this.handleComplainantMenuOpen}
              menuOpen={this.state.complainantMenuOpen}
              handleMenuClose={this.handleComplainantMenuClose}
              anchorEl={this.state.anchorEl}
              classes={classes}
              cnComplaintTypeFeature={this.props.cnComplaintTypeFeature}
              contactInformationFeature={this.props.contactInformationFeature}
            />
            <Witnesses
              caseDetails={this.props.caseDetails}
              dispatch={this.props.dispatch}
              handleMenuOpen={this.handleWitnessMenuOpen}
              menuOpen={this.state.witnessMenuOpen}
              handleMenuClose={this.handleWitnessMenuClose}
              anchorEl={this.state.anchorEl}
              classes={classes}
              cnComplaintTypeFeature={this.props.cnComplaintTypeFeature}
              contactInformationFeature={this.props.contactInformationFeature}
            />
            <Narrative
              initialValues={{
                narrativeDetails: this.props.caseDetails.narrativeDetails,
                narrativeSummary: this.props.caseDetails.narrativeSummary
              }}
              caseId={this.props.caseDetails.id}
              isArchived={this.props.caseDetails.isArchived}
            />
            <Accused
              caseId={this.props.caseDetails.id}
              incidentDate={this.props.caseDetails.incidentDate}
              accusedOfficers={this.props.caseDetails.accusedOfficers}
              dispatch={this.props.dispatch}
              isArchived={this.props.caseDetails.isArchived}
              handleMenuOpen={this.handleAddAccusedMenuOpen}
              menuOpen={this.state.addAccusedMenuOpen}
              handleMenuClose={this.handleAddAccusedMenuClose}
              anchorEl={this.state.anchorEl}
              cnComplaintTypeFeature={this.props.cnComplaintTypeFeature}
            />
            <Attachments isArchived={this.props.caseDetails.isArchived} />
          </main>
          <CivilianDialog />
          <RemoveCivilianDialog data-test="removeCivilianDialog" />
          <CaseNoteDialog />
        </div>
      </div>
    );
  }
}

CaseDetails.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  caseDetails: state.currentCase.details,
  caseTaggingFeature: state.featureToggles.caseTaggingFeature,
  cnComplaintTypeFeature: state.featureToggles.cnComplaintTypeFeature,
  contactInformationFeature: state.featureToggles.contactInformationFeature
});

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps)(CaseDetails)
);