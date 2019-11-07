import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Field,
  formValueSelector,
  reduxForm,
  SubmissionError
} from "redux-form";
import { RadioGroup, TextField } from "redux-form-material-ui";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  Typography,
  withStyles
} from "@material-ui/core";
import FirstNameField from "../../sharedFormComponents/FirstNameField";
import LastNameField from "../../sharedFormComponents/LastNameField";
import {
  PrimaryButton,
  SecondaryButton
} from "../../../shared/components/StyledButtons";
import { closeEditCivilianDialog } from "../../../actionCreators/casesActionCreators";
import {
  genderIdentityIsRequired,
  raceEthnicityIsRequired,
  titleIsRequired
} from "../../../../formFieldLevelValidations";
import DropdownSelect from "./DropdownSelect";
import { withTheme } from "@material-ui/core/styles";
import DateField from "../../sharedFormComponents/DateField";
import MiddleInitialField from "../../sharedFormComponents/MiddleInitialField";
import SuffixField from "../../sharedFormComponents/SuffixField";
import PhoneNumberField from "../../sharedFormComponents/PhoneNumberField";
import EmailField from "../../sharedFormComponents/EmailField";
import { formatAddressAsString } from "../../../utilities/formatAddress";
import moment from "moment";
import { generateMenuOptions } from "../../../utilities/generateMenuOptions";
import validate from "./helpers/validateCivilianFields";
import AddressInput from "./AddressInput";
import {
  CIVILIAN_FORM_NAME,
  COMPLAINANT,
  WITNESS
} from "../../../../../sharedUtilities/constants";
import { nullifyFieldUnlessValid } from "../../../utilities/fieldNormalizers";
import { addressMustBeValid } from "../../../../formValidations";
import AddressSecondLine from "../../sharedFormComponents/AddressSecondLine";
import _ from "lodash";
import normalizeAddress from "../../../utilities/normalizeAddress";
import getRaceEthnicityDropdownValues from "../../../raceEthnicities/thunks/getRaceEthnicityDropdownValues";
import getGenderIdentityDropdownValues from "../../../genderIdentities/thunks/getGenderIdentityDropdownValues";
import getCivilianTitleDropdownValues from "../../../civilianTitles/thunks/getCivilianTitleDropdownValues";
import PrimaryCheckBox from "../../../shared/components/PrimaryCheckBox";

const styles = {
  dialogPaper: {
    minWidth: "40%"
  }
};

class CivilianDialog extends Component {
  componentDidMount() {
    this.props.getRaceEthnicityDropdownValues();
    this.props.getGenderIdentityDropdownValues();
    this.props.getCivilianTitleDropdownValues();
  }

  handleCivilian = (values, dispatch) => {
    const errors = addressMustBeValid(this.props.addressValid);

    if (errors.autoSuggestValue) {
      throw new SubmissionError(errors);
    }
    const contactErrors = validate(
      values,
      this.props.createCaseAddressInputFeature
    );
    if (!_.isEmpty(contactErrors)) {
      throw new SubmissionError(contactErrors);
    }

    dispatch(
      this.props.submitAction({
        ...values,
        birthDate: nullifyFieldUnlessValid(values.birthDate),
        address: normalizeAddress(values.address)
      })
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <Dialog
        open={this.props.open}
        classes={{ paper: classes.dialogPaper }}
        fullWidth
      >
        <DialogTitle data-test="editDialogTitle">
          {this.props.title}
        </DialogTitle>
        <DialogContent style={{ padding: "0px 24px" }}>
          <form>
            <Typography variant="body2" style={{ marginBottom: "8px" }}>
              Role On Case
            </Typography>
            <Field
              name="roleOnCase"
              component={RadioGroup}
              style={{ flexDirection: "row", marginBottom: "24px" }}
              data-test="roleOnCaseRadioGroup"
            >
              <FormControlLabel
                style={{ marginRight: "48px" }}
                value={COMPLAINANT}
                control={<Radio color="primary" />}
                label={COMPLAINANT}
              />
              <FormControlLabel
                style={{ marginRight: "48px" }}
                value={WITNESS}
                control={<Radio color="primary" />}
                label={WITNESS}
              />
            </Field>

            <Typography variant="body2" style={{ marginBottom: "8px" }}>
              Personal Information
            </Typography>
            <div>
              <Field
                required
                name="civilianTitleId"
                component={DropdownSelect}
                label="Title"
                hinttext="Title"
                data-test="titleDropdown"
                style={{
                  width: "95px",
                  marginBottom: "3%"
                }}
                validate={[titleIsRequired]}
              >
                {generateMenuOptions(this.props.civilianTitles)}
              </Field>
            </div>
            <div>
              <FirstNameField name="firstName" />
              <MiddleInitialField
                name="middleInitial"
                style={{
                  width: "40px",
                  marginRight: "5%"
                }}
              />
              <LastNameField name="lastName" />
              <SuffixField
                name="suffix"
                style={{
                  width: "120px"
                }}
              />
            </div>
            <div>
              <DateField
                name="birthDate"
                label="Date of Birth"
                data-test="birthDateField"
                inputProps={{
                  "data-test": "birthDateInput",
                  type: "date",
                  max: moment(Date.now()).format("YYYY-MM-DD")
                }}
                clearable={true}
                style={{
                  minWidth: "140px",
                  marginRight: "5%",
                  marginBottom: "3%"
                }}
              />
              <Field
                required
                name="genderIdentityId"
                component={DropdownSelect}
                label="Gender Identity"
                hinttext="Gender Identity"
                data-test="genderDropdown"
                style={{ width: "30%" }}
                validate={[genderIdentityIsRequired]}
              >
                {generateMenuOptions(this.props.genderIdentities)}
              </Field>
            </div>
            <Field
              required
              name="raceEthnicityId"
              component={DropdownSelect}
              label="Race/Ethnicity"
              hinttext="Race/Ethnicity"
              data-test="raceDropdown"
              style={{ width: "75%" }}
              validate={[raceEthnicityIsRequired]}
            >
              {generateMenuOptions(this.props.raceEthnicities)}
            </Field>
            <FormControlLabel
              key="isAnonymous"
              label="Anonymize complainant in referral letter"
              control={<Field name="isAnonymous" component={PrimaryCheckBox} />}
            />
            <Typography
              variant="body2"
              style={{ marginTop: "24px", marginBottom: "8px" }}
            >
              Contact Information
            </Typography>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%"
              }}
            >
              <PhoneNumberField name="phoneNumber" />
              <Typography
                variant="button"
                style={{
                  marginLeft: "22px",
                  marginTop: "22px",
                  marginRight: "22px"
                }}
              >
                OR
              </Typography>
              <EmailField name="email" autoComplete="disabled" />
              {this.props.createCaseAddressInputFeature && (
                <Typography
                  variant="button"
                  style={{
                    marginLeft: "22px",
                    marginTop: "22px",
                    marginRight: "22px"
                  }}
                >
                  OR
                </Typography>
              )}
            </div>
            <div style={{ display: "flex" }}>
              <div style={{ marginBottom: "16px", width: "100%" }}>
                <AddressInput
                  formName={CIVILIAN_FORM_NAME}
                  fieldName={"address"}
                  addressLabel={"Address"}
                  formattedAddress={this.props.formattedAddress}
                />
              </div>
              <AddressSecondLine
                label={"Address Line 2"}
                fieldName={"address"}
                style={{
                  marginBottom: "24px",
                  width: "50%"
                }}
              />
            </div>

            <Typography variant="body2" style={{ marginBottom: "8px" }}>
              Notes
            </Typography>
            <Field
              name="additionalInfo"
              component={TextField}
              style={{ marginBottom: "16px" }}
              fullWidth
              multiline
              rowsMax={5}
              placeholder="Enter any additional details about the complainant here"
              inputProps={{
                "data-test": "additionalInfoInput"
              }}
              data-test="additionalInfoField"
            />
            <Field type={"hidden"} name={"caseId"} component={TextField} />
          </form>
        </DialogContent>
        <DialogActions
          style={{
            justifyContent: "space-between",
            margin: `${this.props.theme.spacing.unit * 2}px`
          }}
        >
          <SecondaryButton
            data-test="cancelEditCivilian"
            onClick={() => this.props.dispatch(closeEditCivilianDialog())}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            data-test="submitEditCivilian"
            onClick={this.props.handleSubmit(this.handleCivilian)}
            disabled={this.props.submitting}
          >
            {this.props.submitButtonText}
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    );
  }
}

const DialogWithTheme = withTheme()(withStyles(styles)(CivilianDialog));

const connectedForm = reduxForm({
  form: CIVILIAN_FORM_NAME
})(DialogWithTheme);

const mapStateToProps = state => {
  const selector = formValueSelector(CIVILIAN_FORM_NAME);
  const values = selector(
    state,
    "address.streetAddress",
    "address.intersection",
    "address.city",
    "address.state",
    "address.zipCode",
    "address.country",
    "address.lat",
    "address.lng",
    "address.placeId"
  );

  return {
    open: state.ui.civilianDialog.open,
    formattedAddress: formatAddressAsString(values.address),
    submitAction: state.ui.civilianDialog.submitAction,
    title: state.ui.civilianDialog.title,
    submitButtonText: state.ui.civilianDialog.submitButtonText,
    addressValid: state.ui.addressInput.addressValid,
    raceEthnicities: state.ui.raceEthnicities,
    genderIdentities: state.ui.genderIdentities,
    civilianTitles: state.ui.civilianTitles,
    createCaseAddressInputFeature:
      state.featureToggles.createCaseAddressInputFeature
  };
};

const mapDispatchToProps = {
  getRaceEthnicityDropdownValues,
  getGenderIdentityDropdownValues,
  getCivilianTitleDropdownValues
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(connectedForm);