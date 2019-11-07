import OfficerSearch from "./OfficerSearch";
import {
  CIVILIAN_WITHIN_NOPD_TITLE,
  EMPLOYEE_TYPE,
  OFFICER_TITLE
} from "../../../../sharedUtilities/constants";
import { mount } from "enzyme";
import React from "react";
import createConfiguredStore from "../../../createConfiguredStore";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

describe("OfficerSearch test", () => {
  let store, mockPath;
  beforeEach(() => {
    store = createConfiguredStore();
    mockPath = "mockPath";
  });

  test("Should display Officer in title and unknown officer link when searching for an officer", () => {
    const officerSearch = mount(
      <Provider store={store}>
        <Router>
          <OfficerSearch
            employeeSearchTitle={OFFICER_TITLE}
            caseEmployeeType={EMPLOYEE_TYPE.OFFICER}
            path={mockPath}
          />
        </Router>
      </Provider>
    );

    const officerSearchTitle = officerSearch
      .find('[data-test="search-page-header"]')
      .first();

    const unknownOfficerLink = officerSearch
      .find('[data-test="unknown-officer-link"]')
      .first();

    expect(officerSearchTitle.text()).toEqual(`Search for an ${OFFICER_TITLE}`);
    expect(unknownOfficerLink.text()).toEqual(
      "Unable to find an officer? You can Add an Unknown Officer and identify them later."
    );
  });

  test("Should display Employee in title and hide unknown officer link when searching for a civilian within NOPD", () => {
    const officerSearch = mount(
      <Provider store={store}>
        <Router>
          <OfficerSearch
            employeeSearchTitle={CIVILIAN_WITHIN_NOPD_TITLE}
            caseEmployeeType={EMPLOYEE_TYPE.CIVILIAN_WITHIN_NOPD}
            path={mockPath}
          />
        </Router>
      </Provider>
    );

    const officerSearchTitle = officerSearch
      .find('[data-test="search-page-header"]')
      .first();

    const unknownOfficerLink = officerSearch
      .find('[data-test="unknown-officer-link"]')
      .first();

    expect(officerSearchTitle.text()).toEqual(
      `Search for a ${CIVILIAN_WITHIN_NOPD_TITLE}`
    );
    expect(unknownOfficerLink).toEqual({});
  });
});