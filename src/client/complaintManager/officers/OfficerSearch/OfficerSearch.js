import React from "react";
import OfficerSearchForm from "./OfficerSearchForm/OfficerSearchForm";
import { Card, CardContent, Typography } from "@material-ui/core";
import OfficerSearchResults from "./OfficerSearchResults/OfficerSearchResults";
import {
  SelectUnknownOfficerButton,
  SelectUnknownOfficerLink
} from "./OfficerSearchResults/officerSearchResultsRowButtons";
import { EMPLOYEE_TYPE } from "../../../../sharedUtilities/constants";

const OfficerSearch = props => {
  const { employeeSearchTitle, caseEmployeeType } = props;

  const isCivilianWithinNopd =
    caseEmployeeType === EMPLOYEE_TYPE.CIVILIAN_WITHIN_NOPD;

  const searchText = isCivilianWithinNopd
    ? `Search for a ${employeeSearchTitle}`
    : `Search for an ${employeeSearchTitle}`;

  return (
    <div>
      <div style={{ margin: "0 0 32px 0" }}>
        <Typography
          data-test="search-page-header"
          variant="title"
          className="officerSearchHeader"
        >
          {searchText}
        </Typography>
        {isCivilianWithinNopd ? null : (
          <Typography data-test="unknown-officer-link" variant="body1">
            Unable to find an officer? You can{" "}
            <SelectUnknownOfficerLink
              dispatch={props.dispatch}
              initialize={props.initialize}
              path={props.path}
            />{" "}
            and identify them later.
          </Typography>
        )}
      </div>

      <Card
        style={{
          backgroundColor: "white",
          margin: "0 0 32px 0"
        }}
      >
        <CardContent style={{ paddingBottom: "8px" }}>
          <Typography variant="body1" style={{ marginBottom: "8px" }}>
            Search by entering at least one of the following fields:
          </Typography>
          <OfficerSearchForm caseId={props.caseId} />
        </CardContent>
      </Card>
      <OfficerSearchResults
        path={props.path}
        initialize={props.initialize}
        caseEmployeeType={caseEmployeeType}
      />
      {caseEmployeeType === EMPLOYEE_TYPE.OFFICER ? (
        <SelectUnknownOfficerButton
          initialize={props.initialize}
          dispatch={props.dispatch}
          path={props.path}
        />
      ) : null}
    </div>
  );
};

export default OfficerSearch;