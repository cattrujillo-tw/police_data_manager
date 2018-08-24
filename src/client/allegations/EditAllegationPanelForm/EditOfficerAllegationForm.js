import { TextField } from "redux-form-material-ui";
import { Field, reduxForm } from "redux-form";
import {
  PrimaryButton,
  SecondaryButton
} from "../../shared/components/StyledButtons";
import React from "react";
import editOfficerAllegation from "../../cases/thunks/editOfficerAllegation";
import {
  allegationDetailsNotBlank,
  allegationDetailsRequired,
  allegationSeverityRequired
} from "../../formFieldLevelValidations";
import { ExpansionPanelDetails } from "@material-ui/core";
import { allegationSeverityMenu } from "../../utilities/generateMenus";
import NoBlurTextField from "../../cases/CaseDetails/CivilianDialog/FormSelect";

const onSubmit = (values, dispatch) => {
  const { id, details, severity } = values;
  dispatch(editOfficerAllegation({ id, details, severity }));
};

const DetailsForm = ({ handleSubmit, onCancel, invalid, pristine }) => {
  return (
    <ExpansionPanelDetails>
      <div style={{ width: "100%", marginLeft: "64px" }}>
        <form>
          <div>
            <Field
              style={{ width: "15%", marginBottom: "32px" }}
              component={NoBlurTextField}
              name="severity"
              inputProps={{
                "data-test": "editAllegationSeverityInput"
              }}
              label="Allegation Severity"
              validate={[allegationSeverityRequired]}
            >
              {allegationSeverityMenu}
            </Field>
          </div>
          <div>
            <Field
              label={"Allegation Details"}
              name={"details"}
              component={TextField}
              inputProps={{
                "data-test": "allegationInput"
              }}
              validate={[allegationDetailsRequired, allegationDetailsNotBlank]}
              multiline
              rowsMax={5}
              style={{ width: "42%", marginBottom: `16px` }}
            />
          </div>
        </form>
        <div
          style={{
            display: "flex"
          }}
        >
          <SecondaryButton
            data-test="editAllegationCancel"
            onClick={onCancel}
            style={{ marginRight: "8px" }}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            data-test="editAllegationSubmit"
            disabled={invalid || pristine}
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </PrimaryButton>
        </div>
      </div>
    </ExpansionPanelDetails>
  );
};

export default reduxForm()(DetailsForm);
