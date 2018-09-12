import React from "react";
import { Field, reduxForm, submit } from "redux-form";
import { TextField } from "redux-form-material-ui";
import updateNarrative from "../thunks/updateNarrative";
import { CardActions, CardContent, Typography } from "@material-ui/core";
import { PrimaryButton } from "../../shared/components/StyledButtons";
import BaseCaseDetailsCard from "./BaseCaseDetailsCard";
import ReactQuillEditor from "./ReactQuillEditor";

const htmlContents = `
   <p style="color: #7F7F7F;">
        SUSAN HUTSON
    </p>
    <p style="color: #7F7F7F;">
        INDEPENDENT POLICE MONITOR
    </p>
    <p><br></p>
    <p><b>September 10, 2018</b></p>
    <p><br></p>
    <p>Arlinda Westbrook</p>
    <p>Director, Public Integrity Bureau</p>
    <p>New Orleans Police Department</p>
    <p>1340 Poydras Street, Suit 1900</p>
    <p>New Orleans, LA 70112</p>
    <p><br></p>
    <p><strong>RE: Complaint Referral; IPM Complaint #CC2018-0000</strong></p>
    <p><br></p>
    <p>Dear Deputy Superintendent Westbrook:</p>
    <p><br></p>
    <p>This is to inform you pursuant to New Orleans City Code Section 2-1121 (the Police Monitors Ordinance) that the Office of the Independent Police Monitor (IPM) has received a complaint of misconduct by an NOPD employee(s). The complainant related the following information to our office:</p>
    <p><br><p>
    <p class="ql-align-center"><strong><u>Complaint Information</u></strong></p>
    <p><br><p>
    <p><strong><u>IPM Complaint #:</u></strong> CC2018-0000</p>
    <p>Date filed with IPM: 1/1/18</p>
    <p><br></p>
    <p><strong><u>Complainant Information</u></strong></p>
    <p>Name: John Doe, Jr.</p>
    <p>Race: White</p>
    <p>Sex: Male</p>
    <p>Address: 222 Main St, New Orleans, LA 00000</p>
    <p>Cell Phone: (555) 555-5555</p>
    <p><br></p>
    <p class="ql-align-center"><strong><u>Initial Allegations/Concerns/Issues</u></strong></p>
    <p><br></p>
    <p><strong>Police Officer 4 Jane Doe</strong> is accused of the following violations:</p>
    <p><br></p>
    <ul><li>PARAGRAPH 01 – PROFESSIONALISM: Officer Doe alleges that her Sgt. has publicly berated her, engaged in inappropriate physical contact and maintained an unprofessional work environment.</li><li>PARAGRAPH 02 - INSTRUCTIONS FROM AUTHORITATIVE SOURCE to wit Chapter 26.3 Workplace Discrimination, Retaliation and Sexual Harassment: Officer Doe alleges her supervisor violated this policy through inappropriate physical contact.</li></ul>
    <p><br></p>
    <p><strong>Unknown Officer</strong> is accused of the following violations:</p>
    <p><br></p>
    <ul>
        <li>RULE 4: PERFORMANCE OF DUTY: PARAGRAPH 04 – NEGLECT OD DUTY: to wit Chapter 25.1 – Grievances</li>
        <li>RULE 16: Don't break the law</li>
    </ul>
    <p><br></p>
    <p><strong><u>Summary:</u></strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
    <p><br></p>
    <p><strong><u>Detail:</u></strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum<br><br>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>
    <p><br></p>
    <p class="ql-align-center"><strong><u>Request for Review and Possible Reassignment</u></strong></p>
    <p><br></p>
    <p>Custom text with <strong>bold tag</strong> <em>italics tag</em> <strong><em>bold and italics tags</em></strong> <u>underline tag</u>.</p>
    <p><br></p>
    <ol>
        <li>ordered list item 1</li>
        <li>ordered list item 2</li>
    </ol>
    <p><br></p>
    <p>Sincerely,</p>
    <p><img src="Signature-logo.png" alt="signature" style="max-width: 200px;"></p>
    <p>Signature name</p>
    <p>Signature title</p>
    <p>Signature phone</p>`;

// Cannot use function inside a field component, react will recreate the component each time as it will not be able to
// identify the component type from the inline function code, having a constant will help react identify the type and
// prevent recreation of the component so it will not loose focus.
const ReactQuillComponent = props => (
  <ReactQuillEditor
    // initialValue = {htmlContents}
    initialValue={props.input.value}
    onChange={newValue => props.input.onChange(newValue)}
  />
);

const Narrative = props => {
  return (
    <BaseCaseDetailsCard title="Narrative">
      <CardContent>
        <Typography
          style={{
            marginBottom: "24px"
          }}
        >
          Record information gained during the intake process. This information
          will be used to populate a detailed account section of the referral
          letter.
        </Typography>
        <form data-test="createUserForm">
          <Field
            name="narrativeSummary"
            label="Narrative Summary"
            component={TextField}
            fullWidth
            multiline
            rowsMax={5}
            placeholder="Enter a brief, 2-3 sentence summary of the incident"
            inputProps={{
              "data-test": "narrativeSummaryInput",
              maxLength: 500
            }}
            InputLabelProps={{
              shrink: true
            }}
            data-test="narrativeSummaryInput"
            style={{ marginBottom: "24px" }}
          />
          <Field
            name="narrativeDetails"
            label="Narrative Details"
            component={ReactQuillComponent}
            fullWidth
            multiline
            rowsMax={5}
            placeholder="Enter a transcript or details of the incident"
            inputProps={{
              "data-test": "narrativeDetailsInput"
            }}
            InputLabelProps={{
              shrink: true
            }}
            data-test="narrativeDetailsField"
          />
        </form>
      </CardContent>
      <CardActions
        style={{
          justifyContent: "flex-end",
          paddingRight: "0px",
          padding: "0px 16px 16px 0px"
        }}
      >
        <PrimaryButton
          data-test="saveNarrative"
          disabled={props.pristine}
          onClick={() => props.dispatch(submit("Narrative"))}
          style={{ margin: "0px" }}
        >
          Save
        </PrimaryButton>
      </CardActions>
    </BaseCaseDetailsCard>
  );
};

const dispatchUpdateNarrative = (values, dispatch, props) => {
  const updateDetails = {
    ...values,
    id: props.caseId
  };
  dispatch(updateNarrative(updateDetails));
};

export default reduxForm({
  form: "Narrative",
  onSubmit: dispatchUpdateNarrative
})(Narrative);
