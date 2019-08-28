import React, { Component } from "react";
import { connect } from "react-redux";
import NavBar from "../../shared/components/NavBar/NavBar";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import LinkButton from "../../shared/components/LinkButton";
import OfficerSearch from "./OfficerSearch";
import { clearSelectedOfficer } from "../../actionCreators/officersActionCreators";
import {
  CIVILIAN_WITHIN_NOPD_TITLE,
  EMPLOYEE_TYPE,
  OFFICER_TITLE
} from "../../../sharedUtilities/constants";

export class OfficerSearchContainer extends Component {
  componentDidMount() {
    this.props.dispatch(clearSelectedOfficer());
  }

  render() {
    const {
      caseId,
      titleAction,
      officerDetailsPath,
      caseEmployeeType
    } = this.props;

    const employeeSearchTitle =
      caseEmployeeType === EMPLOYEE_TYPE.CIVILIAN_WITHIN_NOPD
        ? CIVILIAN_WITHIN_NOPD_TITLE
        : OFFICER_TITLE;

    return (
      <div>
        <NavBar>
          <Typography
            data-test="officer-search-title"
            variant="title"
            color="inherit"
          >
            {`Case #${this.props.caseReference}   : ${titleAction} ${employeeSearchTitle}`}
          </Typography>
        </NavBar>
        <LinkButton
          data-test="back-to-case-link"
          component={Link}
          to={`/cases/${caseId}`}
          style={{ margin: "2% 0% 2% 4%" }}
        >
          Back to Case
        </LinkButton>
        <div style={{ margin: "0% 5% 3%", maxWidth: "60rem" }}>
          <OfficerSearch
            initialize={this.props.initialize}
            dispatch={this.props.dispatch}
            path={officerDetailsPath}
            employeeSearchTitle={employeeSearchTitle}
            caseEmployeeType={caseEmployeeType}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  caseReference: state.currentCase.details.caseReference,
  caseEmployeeType: state.officers.addOfficer.caseEmployeeType
});

export default connect(mapStateToProps)(OfficerSearchContainer);
