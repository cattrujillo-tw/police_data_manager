import React, { Component } from "react";
import getCaseDetails from "../cases/thunks/getCaseDetails";
import { connect } from "react-redux";
import NavBar from "../sharedComponents/NavBar/NavBar";
import { Typography } from "material-ui";
import { Link } from "react-router-dom";
import LinkButton from "../sharedComponents/LinkButton";
import OfficersSnackbar from "./OfficersSnackBar/OfficersSnackbar";
import OfficerDetails from "./OfficerDetails/OfficerDetails";
import { clearSelectedOfficer } from "../actionCreators/officersActionCreators";
import { push } from "react-router-redux";
import { snackbarError } from "../actionCreators/snackBarActionCreators";

export class OfficerDetailsContainer extends Component {
  componentDidMount() {
    if (`${this.props.caseId}` !== this.props.match.params.id) {
      this.props.dispatch(getCaseDetails(this.props.match.params.id));
    }

    if (!this.props.officerCurrentlySelected) {
      this.props.dispatch(
        push(`/cases/${this.props.match.params.id}/officers/search`)
      );
      this.props.dispatch(
        snackbarError("Please select an officer or unknown officer to continue")
      );
    }
  }

  render() {
    const { caseId, selectedOfficerData } = this.props;
    if (`${caseId}` !== this.props.match.params.id) {
      return null;
    }

    return (
      <div>
        <NavBar>
          <Typography data-test="pageTitle" variant="title" color="inherit">
            {`Case #${caseId}   : Add Officer`}
          </Typography>
        </NavBar>
        <LinkButton
          data-test="back-to-case-link"
          component={Link}
          to={`/cases/${caseId}`}
          style={{ margin: "2% 0% 2% 4%" }}
          onClick={() => this.props.dispatch(clearSelectedOfficer())}
        >
          Back to Case
        </LinkButton>
        <div style={{ margin: "0% 5% 3%" }}>
          <OfficerDetails
            caseId={this.props.caseId}
            selectedOfficerData={selectedOfficerData}
          />
        </div>
        <OfficersSnackbar />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  caseId: state.currentCase.details.id,
  selectedOfficerData: state.officers.selectedOfficerData,
  officerCurrentlySelected: state.officers.officerCurrentlySelected
});

export default connect(mapStateToProps)(OfficerDetailsContainer);
