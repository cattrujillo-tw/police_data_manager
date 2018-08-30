import React, { Component } from "react";
import NavBar from "../../../shared/components/NavBar/NavBar";
import { CardContent, Typography, withStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import LinkButton from "../../../shared/components/LinkButton";
import { connect } from "react-redux";

import BaseCaseDetailsCard from "../BaseCaseDetailsCard";
import CivilianInfoDisplay from "../ComplainantWitnesses/CivilianInfoDisplay";
import formatDate, {
  computeTimeZone,
  format12HourTime
} from "../../../utilities/formatDate";
import AddressInfoDisplay from "../../../shared/components/AddressInfoDisplay";
import getCaseDetails from "../../thunks/getCaseDetails";
import styles from "../caseDetailsStyles";
import * as htmlDocx from "html-docx-js/dist/html-docx";
import DownloadButton from "./DownloadButton";

class CaseLetter extends Component {
  componentDidMount() {
    this.props.dispatch(getCaseDetails(this.props.match.params.id));
  }

  formatTimeForDisplay = (date, time) => {
    if (!time) return time;
    return format12HourTime(time) + " " + computeTimeZone(date, time);
  };

  generateLetter = () => {
    const htmlDoc = document.getElementsByTagName("main")[0];
    const converted = htmlDocx.asBlob(htmlDoc.innerHTML);

    console.log("Word doc is :", converted);
    return {
      mime:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      filename: "caseLetter.docx",
      contents: converted
    };
  };

  render() {
    const caseId = this.props.match.params.id;

    return (
      <div>
        <NavBar>
          <Typography
            data-test="pageTitle"
            variant="title"
            color="inherit"
            style={{ marginRight: "20px" }}
          >
            {`Case #${caseId} : Case Letter`}
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

        <main>
          <BaseCaseDetailsCard title="Incident Details">
            <CardContent style={{ padding: "24px" }}>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  paddingRight: 0,
                  marginBottom: "26px"
                }}
              >
                <CivilianInfoDisplay
                  displayLabel="First Contacted IPM"
                  value={formatDate(this.props.caseDetail.firstContactDate)}
                  testLabel="firstContactDate"
                />
                <CivilianInfoDisplay
                  displayLabel="Incident Date"
                  value={formatDate(this.props.caseDetail.incidentDate)}
                  testLabel="incidentDate"
                />
                <CivilianInfoDisplay
                  displayLabel="Incident Time"
                  value={this.formatTimeForDisplay(
                    this.props.caseDetail.incidentDate,
                    this.props.caseDetail.incidentTime
                  )}
                  testLabel="incidentTime"
                />
              </div>
              <div style={{ display: "flex", width: "100%", paddingRight: 0 }}>
                <AddressInfoDisplay
                  testLabel="incidentLocation"
                  displayLabel="Incident Location"
                  address={this.props.caseDetail.incidentLocation}
                  style={{ flex: 2 }}
                />
                <CivilianInfoDisplay
                  displayLabel="District"
                  value={this.props.caseDetail.district}
                  testLabel="incidentDistrict"
                />
                <div style={{ width: "69.5px" }} />
              </div>
            </CardContent>
          </BaseCaseDetailsCard>

          {/*Narrative*/}
          <BaseCaseDetailsCard title="Narrative">
            <CardContent>
              <Typography
                style={{
                  marginBottom: "24px"
                }}
              >
                {this.props.caseDetail.narrativeSummary}
              </Typography>

              <div
                dangerouslySetInnerHTML={{
                  __html: this.props.caseDetail.narrativeDetails
                }}
              />
            </CardContent>
          </BaseCaseDetailsCard>
        </main>

        <DownloadButton
          generateTitle="Generate Letter"
          className="waves-effect waves-light btn"
          genFile={this.generateLetter}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  caseDetail: state.currentCase.details
});

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps)(CaseLetter)
);
