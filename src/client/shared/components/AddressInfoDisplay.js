import React from "react";
import {
  formatAddressWithLineBreak,
  formatAddressAsString
} from "../../utilities/formatAddress";
import { Typography } from "@material-ui/core";

const AddresesInfoDisplay = ({
  testLabel,
  displayLabel,
  address,
  useLineBreaks
}) => {
  let formattedAddress = useLineBreaks
    ? formatAddressWithLineBreak(address)
    : formatAddressAsString(address);
  if (!Boolean(formattedAddress)) {
    formattedAddress = "No address specified";
  }
  return (
    <div style={{ flex: 1, textAlign: "left", marginRight: "10px" }}>
      <Typography variant="caption">{displayLabel}</Typography>
      <Typography variant="body1" data-test={testLabel}>
        {formattedAddress}
      </Typography>
      <Typography variant="body1" data-test={`${testLabel}AdditionalInfo`}>
        {address && address.streetAddress2 ? address.streetAddress2 : ""}
      </Typography>
    </div>
  );
};

export default AddresesInfoDisplay;
