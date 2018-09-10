import React, { Component } from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import NavBar from "../../../shared/components/NavBar/NavBar";
import getCaseDetails from "../../thunks/getCaseDetails";
import * as _ from "lodash";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import { withStyles } from "@material-ui/core/styles/index";
import { connect } from "react-redux";
import styles from "../../CaseDetails/caseDetailsStyles";
import { Link } from "react-router-dom";
import LinkButton from "../../../shared/components/LinkButton";

class LetterPreview extends Component {
  componentDidMount() {
    this.props.dispatch(getCaseDetails(this.props.match.params.id));
  }
  caseDetailsNotYetLoaded() {
    return (
      _.isEmpty(this.props.caseDetail) ||
      `${this.props.caseDetail.id}` !== this.props.match.params.id
    );
  }

  render() {
    const paragraph = { margin: "24px 0" };
    const paragraphLabel = { fontWeight: "bold", textDecoration: "underline" };
    const sectionTitle = {
      ...paragraph,
      fontWeight: "bold",
      textDecoration: "underline",
      textAlign: "center"
    };
    const headingDate = { ...paragraph, fontWeight: "bold" };

    if (this.caseDetailsNotYetLoaded()) {
      return null;
    }

    const statusIsClosed = this.props.caseDetail.status === CASE_STATUS.CLOSED;
    const { classes, caseDetail } = this.props;

    return (
      <div>
        <NavBar isHome={false}>
          <Typography
            data-test="pageTitle"
            variant="title"
            color="inherit"
            style={{ marginRight: "20px" }}
          >
            {`Case #${caseDetail.id}`}
          </Typography>
          <Typography
            data-test="caseStatusBox"
            variant="caption"
            color="inherit"
            className={
              statusIsClosed ? classes.closedStatusBox : classes.statusBox
            }
          >
            {caseDetail.status}
          </Typography>
        </NavBar>
        <LinkButton
          data-test="back-to-case-link"
          component={Link}
          to={`/cases/${caseDetail.id}`}
          style={{ margin: "2% 0% 2% 4%" }}
        >
          Back to Case
        </LinkButton>
        <div style={{ margin: "0% 5% 3%" }}>
          <div style={{ margin: "0 0 32px" }}>
            <Typography variant="title">Preview</Typography>
          </div>
          <Card
            style={{
              backgroundColor: "white",
              width: "60%",
              margin: "0 0 32px 0"
            }}
          >
            <CardContent>
              <div style={headingDate}>September 10, 2018</div>
              <div style={paragraph}>
                <div>Arlinda Westbrook</div>
                <div>Director, Public Integrity Bureau</div>
                <div>New Orleans Police Department</div>
                <div>1340 Poydras Street, Suit 1900</div>
                <div>New Orleans, LA 70112</div>
              </div>
              <div style={paragraph}>
                <span style={{ marginLeft: "16px", fontWeight: "bold" }}>
                  RE:
                </span>
                <span style={{ marginLeft: "16px", fontWeight: "bold" }}>
                  Complaint Referral; IPM Complaint #CC2018-0000
                </span>
              </div>
              <div style={paragraph}>Dear Deputy Superintendent Westbrook:</div>
              <div style={paragraph}>
                This is to inform you pursuant to New Orleans City Code Section
                2-1121 (the Police Monitors Ordinance) that the Office of the
                Independent Police Monitor (IPM) has received a complaint of
                misconduct by an NOPD employee(s). The complainant related the
                following information to our office:
              </div>
              <div style={sectionTitle}>Complaint Information</div>
              <div style={paragraph}>
                <div>
                  <span style={paragraphLabel}>IPM Complaint #:</span>
                  <span> CC2018-0000</span>
                </div>
                <div>Date filed with IPM: 1/1/18</div>
              </div>
              <div style={paragraph}>
                <div style={paragraphLabel}>Complainant Information</div>
                <div>Name: John Doe, Jr.</div>
                <div>Race: White</div>
                <div>Sex: Male</div>
                <div>Address: 222 Main St, New Orleans, LA 00000</div>
                <div>Cell Phone: (555)555-5555</div>
              </div>

              <div style={sectionTitle}>
                Initial Allegations/Concerns/Issues
              </div>
              <div style={paragraph}>
                <span style={{ fontWeight: "bold" }}>
                  Police Officer 4 Jane Doe [111/2222]
                </span>{" "}
                is accused of the following violations:
                <ul>
                  <li>
                    PARAGRAPH 01 – PROFESSIONALISM: Officer Doe alleges that her
                    Sgt. has publicly berated her, engaged in inappropriate
                    physical contact and maintained an unprofessional work
                    environment.
                  </li>
                  <li>
                    PARAGRAPH 02 - INSTRUCTIONS FROM AUTHORITATIVE SOURCE to wit
                    Chapter 26.3 Workplace Discrimination, Retaliation and
                    Sexual Harassment: Officer Doe alleges her supervisor
                    violated this policy through inappropriate physical contact.
                  </li>
                </ul>
              </div>
              <div style={paragraph}>
                <span style={{ fontWeight: "bold" }}>Unknown Officer</span> is
                accused of the following violations:
                <ul>
                  <li>
                    RULE 4: PERFORMANCE OF DUTY: PARAGRAPH 04 – NEGLECT OD DUTY:
                    to wit Chapter 25.1 – Grievances
                  </li>
                </ul>
              </div>

              <div style={paragraph}>
                <span style={paragraphLabel}>Summary:</span> Lorem ipsum dolor
                sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum
              </div>
              <div style={paragraph}>
                <span style={paragraphLabel}>Detail:</span> Lorem ipsum dolor
                sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum
                <br />
                <br />
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae
                vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
                voluptas sit aspernatur aut odit aut fugit, sed quia
                consequuntur magni dolores eos qui ratione voluptatem sequi
                nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor
                sit amet, consectetur, adipisci velit, sed quia non numquam eius
                modi tempora incidunt ut labore et dolore magnam aliquam quaerat
                voluptatem. Ut enim ad minima veniam, quis nostrum
                exercitationem ullam corporis suscipit laboriosam, nisi ut
                aliquid ex ea commodi consequatur? Quis autem vel eum iure
                reprehenderit qui in ea voluptate velit esse quam nihil
                molestiae consequatur, vel illum qui dolorem eum fugiat quo
                voluptas nulla pariatur?
              </div>

              <div style={sectionTitle}>
                Request for Review and Possible Reassignment
              </div>
              <div style={paragraph}>
                Custom text with <b>bold tag</b> <i>italics tag</i>{" "}
                <u>underline tag</u>.
                <ol>
                  <li>ordered list item 1</li>
                  <li>ordered list item 2</li>
                </ol>
              </div>
              <div style={paragraph}>
                <div>Sincerely,</div>
                <div>
                  <img
                    style={{ maxWidth: "200px" }}
                    src="/Signature-logo.png"
                    alt="signature"
                  />
                </div>
                <div>Signature name</div>
                <div>Signature title</div>
                <div>Signature phone</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  caseDetail: state.currentCase.details
});

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps)(LetterPreview)
);
