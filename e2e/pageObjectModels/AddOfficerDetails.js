const e2e = require("./e2eUtilities.js");

const AddOfficerDetailsCommands = {
  isOnPageForUnknownOfficer: function () {
    return this.waitForElementVisible(
      "@unknownOfficerMessage",
      e2e.rerenderWait
    );
  },
  selectRole: function (roleId) {
    return this.waitForElementPresent("@roleDropdown", e2e.rerenderWait)
      .click("@roleDropdown", e2e.logOnClick)
      .waitForElementPresent("@roleMenu", e2e.rerenderWait)
      .click({ selector: "@toSelect", index: roleId }, e2e.logOnClick)
      .waitForElementNotPresent("@roleMenu", e2e.rerenderWait);
  },
  submitOfficer: function () {
    this.waitForElementVisible("@submitOfficerButton", e2e.rerenderWait).click(
      "@submitOfficerButton",
      e2e.logOnClick
    );
  }
};

module.exports = {
  commands: [AddOfficerDetailsCommands],
  elements: {
    unknownOfficerMessage: {
      selector: "[data-testid='unknownOfficerMessage']"
    },
    roleDropdown: {
      selector: '[data-testid="roleOnCaseInput"] + div > button'
    },
    roleMenu: {
      selector: ".MuiAutocomplete-popper"
    },
    submitOfficerButton: {
      selector: '[data-testid="officerSubmitButton"]'
    },
    toSelect: {
      selector: "li"
    }
  }
};
