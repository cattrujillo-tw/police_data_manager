import React from "react";
import { mount, shallow } from "enzyme";
import OfficerSearchForm from "./OfficerSearchForm";
import { PrimaryButton } from "../../../shared/components/StyledButtons";
import createConfiguredStore from "../../../../createConfiguredStore";
import getSearchResults from "../../../shared/thunks/getSearchResults";
import { Provider } from "react-redux";
import { changeInput, selectDropdownOption } from "../../../../testHelpers";
import { getDistrictsSuccess } from "../../../actionCreators/districtsActionCreators";

jest.mock(
  "../../../shared/thunks/getSearchResults",
  () => (searchCriteria, resourceToSearch) => ({
    type: "something",
    searchCriteria,
    resourceToSearch
  })
);

describe("OfficerSearchForm", () => {
  describe("submit button", () => {
    test("submit button should be disabled when form is not valid", () => {
      const searchForm = mount(
        <Provider store={createConfiguredStore()}>
          <OfficerSearchForm handleSubmit={() => {}} invalid={true} />
        </Provider>
      );
      const submitButton = searchForm.find(PrimaryButton);
      expect(!!submitButton.disabled).toBeTruthy;
    });

    test("submit button should be enabled when form is valid", () => {
      const searchForm = mount(
        <Provider store={createConfiguredStore()}>
          <OfficerSearchForm handleSubmit={() => {}} invalid={false} />
        </Provider>
      );
      const submitButton = searchForm.find(PrimaryButton);
      expect(!!submitButton.disabled).toBeFalsy();
    });
  });

  describe("onSubmit", () => {
    test("dispatches searchOfficer on submit", () => {
      const store = createConfiguredStore();
      const dispatchSpy = jest.spyOn(store, "dispatch");

      store.dispatch(
        getDistrictsSuccess([
          ["1st District", 1],
          ["2nd District", 2]
        ])
      );

      const officerSearchForm = mount(
        <Provider store={store}>
          <OfficerSearchForm />
        </Provider>
      );
      changeInput(officerSearchForm, "[data-testid='firstNameField']", "emma");
      changeInput(officerSearchForm, "[data-testid='lastNameField']", "watson");
      selectDropdownOption(
        officerSearchForm,
        "[data-testid='districtField']",
        "1st District"
      );

      officerSearchForm.find(PrimaryButton).simulate("click");
      expect(dispatchSpy).toHaveBeenCalledWith(
        getSearchResults(
          {
            firstName: "emma",
            lastName: "watson",
            districtId: 1
          },
          "officers"
        )
      );
    });

    test("normalizes first and last name on submit", () => {
      const store = createConfiguredStore();
      const dispatchSpy = jest.spyOn(store, "dispatch");

      store.dispatch(
        getDistrictsSuccess([
          ["1st District", 1],
          ["2nd District", 2]
        ])
      );

      const officerSearchForm = mount(
        <Provider store={store}>
          <OfficerSearchForm />
        </Provider>
      );
      changeInput(
        officerSearchForm,
        "[data-testid='firstNameField']",
        " bubba joe "
      );
      changeInput(
        officerSearchForm,
        "[data-testid='lastNameField']",
        " smith "
      );
      selectDropdownOption(
        officerSearchForm,
        "[data-testid='districtField']",
        "1st District"
      );

      officerSearchForm.find(PrimaryButton).simulate("click");
      expect(dispatchSpy).toHaveBeenCalledWith(
        getSearchResults(
          {
            firstName: "bubba joe",
            lastName: "smith",
            districtId: 1
          },
          "officers"
        )
      );
    });
  });
});
