import React, { Component } from "react";
import getCaseDetails from "../cases/thunks/getCaseDetails";
import { connect } from "react-redux";
import NavBar from "../sharedComponents/NavBar/NavBar";
import { Typography } from "material-ui";
import { Link } from "react-router-dom";
import LinkButton from "../sharedComponents/LinkButton";
import OfficersSnackbar from "./OfficersSnackBar/OfficersSnackbar";
import OfficerSearch from "./OfficerSearch/OfficerSearch";
import { clearSelectedOfficer } from "../actionCreators/officersActionCreators";

export class OfficerSearchContainer extends Component {
  componentDidMount() {
    if (`${this.props.caseId}` !== this.props.match.params.id) {
      this.props.dispatch(getCaseDetails(this.props.match.params.id));
    }
  }

  componentWillMount() {
    this.props.dispatch(clearSelectedOfficer());
  }

  render() {
    const { caseId } = this.props;
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
          <OfficerSearch
            match={this.props.match}
            dispatch={this.props.dispatch}
            caseId={caseId}
          />
        </div>
        <OfficersSnackbar />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  caseId: state.currentCase.details.id
});

export default connect(mapStateToProps)(OfficerSearchContainer);
