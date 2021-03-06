import React from "react";
import { Field } from "redux-form";
import { renderTextField } from "./renderFunctions";

const AdditionalLocationInfo = ({ label, fieldName, style }) => {
  return (
    <Field
      label={label}
      name={`${fieldName}.additionalLocationInfo`}
      component={renderTextField}
      style={style}
      inputProps={{
        "data-testid": "additionalLocationInfoInput",
        maxLength: 255,
        autoComplete: "off"
      }}
      multiline
      InputLabelProps={{ shrink: true }}
      data-testid="additionalLocationInfo"
      placeholder={"Ex: In front of building"}
    />
  );
};

export default AdditionalLocationInfo;
