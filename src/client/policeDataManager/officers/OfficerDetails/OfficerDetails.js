import React from "react";
import {
  Card,
  CardContent,
  FormControlLabel,
  Typography
} from "@material-ui/core";
import { Field, reduxForm } from "redux-form";
import styles from "../../../common/globalStyling/styles";
import { PrimaryButton } from "../../shared/components/StyledButtons";
import Dropdown from "../../../common/components/Dropdown";
import { roleOnCaseMenu } from "../../utilities/generateMenuOptions";
import { officerRoleRequired } from "../../../formFieldLevelValidations";
import PrimaryCheckBox from "../../shared/components/PrimaryCheckBox";
import {
  CIVILIAN_WITHIN_NOPD_TITLE,
  COMPLAINANT,
  EMPLOYEE_TYPE,
  OFFICER_DETAILS_FORM_NAME,
  OFFICER_TITLE,
  WITNESS
} from "../../../../sharedUtilities/constants";
import SelectedOfficerDisplay from "./SelectedOfficerDisplay";
import UnknownOfficerDisplay from "./UnknownOfficerDisplay";
import _ from "lodash";
import EmailField from "../../cases/sharedFormComponents/EmailField";
import PhoneNumberField from "../../cases/sharedFormComponents/PhoneNumberField";
import { renderTextField } from "../../cases/sharedFormComponents/renderFunctions";

class OfficerDetails extends React.Component {
  onSubmit = (values, dispatch) => {
    dispatch(this.props.submitAction(values));
  };

  updateRoleOnCase = values => {
    this.setState({
      roleOnCase: values
    });
  };

  isOfficerComplainantOrWitness = () => {
    const roleOnCase =
      (this.state && this.state.roleOnCase) || this.props.initialRoleOnCase;
    return roleOnCase === COMPLAINANT || roleOnCase === WITNESS;
  };

  shouldShowAnonymousCheckbox = () => {
    return this.isOfficerComplainantOrWitness() && this.props.selectedOfficer;
  };

  render() {
    const isCivilianWithinNopd =
      this.props.caseEmployeeType === EMPLOYEE_TYPE.CIVILIAN_WITHIN_NOPD;
    const additionalInformationText = isCivilianWithinNopd
      ? `Use this section to add notes, a description, or indicate any information about the ${_.lowerFirst(
          CIVILIAN_WITHIN_NOPD_TITLE
        )}.`
      : `Use this section to add notes, a description, or indicate any information about the ${_.toLower(
          OFFICER_TITLE
        )}’s history or risk assessment.`;
    const caseEmployeeTitle = isCivilianWithinNopd
      ? CIVILIAN_WITHIN_NOPD_TITLE
      : OFFICER_TITLE;

    return (
      <div>
        <Typography variant="h6">Selected {caseEmployeeTitle}</Typography>
        {this.props.selectedOfficer ? (
          <SelectedOfficerDisplay {...this.props} />
        ) : (
          <UnknownOfficerDisplay {...this.props} />
        )}
        <Typography variant="h6" style={{ marginBottom: "16px" }}>
          Additional Info
        </Typography>
        <Card style={{ backgroundColor: "white", marginBottom: "16px" }}>
          <CardContent>
            <form>
              <div style={{ marginBottom: "24px" }}>
                <Field
                  inputProps={{
                    "data-testid": "roleOnCaseInput"
                  }}
                  data-testid="roleOnCaseDropdown"
                  component={Dropdown}
                  name="roleOnCase"
                  required
                  validate={[officerRoleRequired]}
                  label="Role on Case"
                  style={{ width: "9rem" }}
                  onChange={this.updateRoleOnCase}
                >
                  {roleOnCaseMenu}
                </Field>
                <br />
                {!this.shouldShowAnonymousCheckbox() ? null : (
                  <FormControlLabel
                    data-testid="isOfficerAnonymous"
                    key="isAnonymous"
                    label={`Anonymize ${this.props.caseEmployeeTitle} in referral letter`}
                    control={
                      <Field name="isAnonymous" component={PrimaryCheckBox} />
                    }
                  />
                )}
              </div>
              {this.isOfficerComplainantOrWitness() ? (
                <div>
                  <Typography style={styles.section}>
                    Contact Information
                  </Typography>
                  <br />
                  <div style={{ display: "flex" }}>
                    <PhoneNumberField name="phoneNumber" />
                    <span style={{ marginRight: "5%" }} />
                    <EmailField name="email" />
                  </div>
                </div>
              ) : null}
              <Typography style={styles.section}>Notes</Typography>
              <Typography variant="body2">
                {additionalInformationText}
              </Typography>
              <Field
                component={renderTextField}
                name="notes"
                data-testid="notesField"
                multiline
                rowsMax={8}
                style={{ width: "60%" }}
              />
            </form>
          </CardContent>
        </Card>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <PrimaryButton
            data-testid="officerSubmitButton"
            disabled={this.props.submitting}
            onClick={this.props.handleSubmit(this.onSubmit)}
          >
            {this.props.submitButtonText}
          </PrimaryButton>
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: OFFICER_DETAILS_FORM_NAME
})(OfficerDetails);