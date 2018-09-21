import React, { Component } from "react";
import { Typography } from "@material-ui/core";
import NavBar from "../../shared/components/NavBar/NavBar";
import { connect } from "react-redux";
import * as _ from "lodash";
import getCaseDetails from "../thunks/getCaseDetails";
import { Link } from "react-router-dom";
import LinkButton from "../../shared/components/LinkButton";
import LetterProgressStepper from "./LetterProgressStepper";
import CaseDetailCard from "./CaseDetailCard";
import {
  getAccusedOfficerData,
  getAllegationData,
  getComplainantData,
  getIncidentInfoData,
  getWitnessData
} from "./CaseDetailDataHelpers";
import TextTruncate from "../../shared/components/TextTruncate";

export class LetterReview extends Component {
  caseDetailsNotYetLoaded() {
    return (
      _.isEmpty(this.props.caseDetail) ||
      `${this.props.caseDetail.id}` !== this.props.match.params.id
    );
  }

  componentDidMount() {
    this.props.dispatch(getCaseDetails(this.props.match.params.id));
  }

  render() {
    const { caseDetail } = this.props;
    const caseId = this.props.match.params.id;

    if (this.caseDetailsNotYetLoaded()) {
      return null;
    }

    const narrativeSummaryCardData = (
      <Typography>{caseDetail.narrativeSummary}</Typography>
    );

    const narrativeDetailsCardData = (
      <TextTruncate
        testLabel="letterReviewNarrativeDetails"
        message={
          caseDetail.narrativeDetails ? caseDetail.narrativeDetails : "N/A"
        }
      />
    );

    return (
      <div>
        <NavBar>
          <Typography data-test="pageTitle" variant="title" color="inherit">
            {`Case #${caseId}   : Letter Generation`}
          </Typography>
        </NavBar>

        <LinkButton
          data-test="return-to-case-link"
          component={Link}
          to={`/cases/${caseId}`}
          style={{ margin: "2% 0% 2% 4%" }}
        >
          Return to Case
        </LinkButton>

        <LetterProgressStepper />

        <div style={{ margin: "0% 5% 3%" }}>
          <div style={{ margin: "0 0 32px 0" }}>
            <Typography variant="title">Review Case Details</Typography>
          </div>

          <CaseDetailCard
            cardTitle={"Incident Info"}
            cardData={getIncidentInfoData(caseDetail)}
          />

          <CaseDetailCard
            cardTitle={"Narrative Summary"}
            cardData={narrativeSummaryCardData}
          />

          <CaseDetailCard
            cardTitle={"Narrative Details"}
            cardData={narrativeDetailsCardData}
          />

          <CaseDetailCard
            cardTitle={"Complainant Information"}
            cardData={getComplainantData(caseDetail)}
          />

          <CaseDetailCard
            cardTitle={"Witness Information"}
            cardData={getWitnessData(caseDetail)}
          />

          {caseDetail.accusedOfficers.map(officer => {
            return (
              <CaseDetailCard
                cardTitle={"Accused Officer"}
                cardData={getAccusedOfficerData(officer)}
                cardSecondTitle={"Allegations"}
                allegations={getAllegationData(officer)}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  caseDetail: state.currentCase.details,
  featureToggles: state.featureToggles
});

export default connect(mapStateToProps)(LetterReview);
