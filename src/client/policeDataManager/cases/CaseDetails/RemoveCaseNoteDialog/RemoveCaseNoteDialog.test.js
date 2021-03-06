import RemoveCaseNoteDialog from "./RemoveCaseNoteDialog";
import createConfiguredStore from "../../../../createConfiguredStore";
import {
  closeRemoveCaseNoteDialog,
  openRemoveCaseNoteDialog
} from "../../../actionCreators/casesActionCreators";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import React from "react";
import removeCaseNote from "../../thunks/removeCaseNote";

jest.mock("../../thunks/removeCaseNote", () => (caseId, caseNoteId) => ({
  type: "MOCK_ACTION",
  caseId,
  caseNoteId
}));

describe("RemoveCaseNoteDialog", function() {
  test("should call removeCaseNote thunk with correct values", () => {
    const store = createConfiguredStore();
    const activity = {
      id: 1,
      caseId: 2
    };
    const dispatchSpy = jest.spyOn(store, "dispatch");

    store.dispatch(openRemoveCaseNoteDialog(activity));

    const wrapper = mount(
      <Provider store={store}>
        <RemoveCaseNoteDialog />
      </Provider>
    );

    const removeCaseNoteButton = wrapper
      .find('[data-testid="removeCaseNote"]')
      .first();
    removeCaseNoteButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      removeCaseNote(activity.caseId, activity.id)
    );
  });

  test("should close dialog when cancel button clicked", function() {
    const store = createConfiguredStore();
    store.dispatch(openRemoveCaseNoteDialog());
    const dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapper = mount(
      <Provider store={store}>
        <RemoveCaseNoteDialog />
      </Provider>
    );

    const cancelButton = wrapper.find('[data-testid="cancelButton"]').first();
    cancelButton.simulate("click");
    expect(dispatchSpy).toHaveBeenCalledWith(closeRemoveCaseNoteDialog());
  });
});
