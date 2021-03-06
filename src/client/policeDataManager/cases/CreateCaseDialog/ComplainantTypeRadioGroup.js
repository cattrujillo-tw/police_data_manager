import React from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography
} from "@material-ui/core";
import {
  CIVILIAN_INITIATED,
  RANK_INITIATED
} from "../../../../sharedUtilities/constants";

const {
  CIVILIAN_WITHIN_PD_TITLE,
  CIVILIAN_WITHIN_PD_INITIATED
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

export default props => (
  <FormControl>
    <Typography variant="subtitle2" style={{ marginBottom: "8px" }}>
      Complainant Information
    </Typography>
    <FormLabel>The complainant is a...</FormLabel>
    <RadioGroup
      style={{ flexDirection: "row" }}
      {...props}
      value={props.input.value}
    >
      <FormControlLabel
        style={{ marginRight: "48px" }}
        data-testid="civilianRadioButton"
        value={CIVILIAN_INITIATED}
        control={<Radio color="primary" />}
        label="Civilian"
        onClick={() => props.input.onChange(CIVILIAN_INITIATED)}
      />
      <FormControlLabel
        data-testid="officerRadioButton"
        value={RANK_INITIATED}
        control={<Radio color="primary" />}
        label="Police Officer"
        onClick={() => props.input.onChange(RANK_INITIATED)}
      />
      <FormControlLabel
        data-testid="civilianWithinPDRadioButton"
        value={CIVILIAN_WITHIN_PD_INITIATED}
        control={<Radio color="primary" />}
        label={CIVILIAN_WITHIN_PD_TITLE}
        onClick={() => props.input.onChange(CIVILIAN_WITHIN_PD_INITIATED)}
      />
    </RadioGroup>
  </FormControl>
);
