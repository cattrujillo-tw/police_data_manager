import { mount } from "enzyme";
import AddressAutoSuggest from "./AddressAutoSuggest";
import React from "react";
import { containsText } from "../../../testHelpers";
import { Provider } from "react-redux";
import createConfiguredStore from "../../../createConfiguredStore";

describe("AddressAutoSuggest", () => {
  let store, cannedSuggestions, mapService;
  beforeEach(() => {
    store = createConfiguredStore();
    cannedSuggestions = ["123 main street", "Chicago, IL", "Burma"];
    mapService = {
      //returns suggestion value for updating input value
      getSuggestionValue: jest.fn(() => suggestion => {
        return suggestion;
      }),

      //fetches suggestions if need be, call calback with results
      onFetchSuggestions: jest.fn(() => (input, callback) => {
        callback(cannedSuggestions);
      }),

      //after selecting a suggestion, what else should be done?
      onSuggestionSelected: jest.fn(() => suggestion => {
        return suggestion;
      }),

      healthCheck: jest.fn()
    };
  });

  test("should display a label", () => {
    let autoSuggestWrapper, label;
    label = "Test Label";
    autoSuggestWrapper = mount(
      <Provider store={store}>
        <AddressAutoSuggest
          label={label}
          data-test="my-custom-autosuggest"
          mapService={mapService}
          input={{}}
          meta={{ error: "Error" }}
          onBlur={() => {}}
        />
      </Provider>
    );

    containsText(
      autoSuggestWrapper,
      '[data-test="my-custom-autosuggest"]',
      label
    );
  });
});
