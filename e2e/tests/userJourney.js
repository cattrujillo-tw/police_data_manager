const path = require("path");

const TEST_USER = process.env.TEST_USER;
const TEST_PASS = process.env.TEST_PASS;
const HOST = process.env.HOST;

if (!TEST_PASS) {
  console.log("Set the password in the ENV VAR 'TEST_PASS' for login");
  process.exit(1);
}
if (!TEST_USER) {
  console.log("Set the username in the ENV VAR 'TEST_USER' for login");
  process.exit(1);
}
if (!HOST) {
  console.log("Set the host in the ENV VAR 'HOST' for login");
  process.exit(1);
}

if (TEST_PASS && TEST_USER && HOST) {
  const roundTripWait = 25000;
  const rerenderWait = 2000;

  module.exports = {
    "should see sign-in title": browser => {
      browser.url(HOST).resizeWindow(1366, 768);
    },

    "should authenticate": browser => {
      const loginPage = browser.page.Login();
      loginPage.isOnPage().loginAs(TEST_USER, TEST_PASS);
    },

    "should create case": browser => {
      const caseDashboardPage = browser.page.CaseDashboard();
      const snackbar = browser.page.SnackbarPOM();

      caseDashboardPage
        .isOnPage()
        .createNewCase()
        .setFirstName("Night")
        .setLastName("Watch")
        .setPhoneNumber("1234567890", browser)
        .submitCase();
      snackbar.presentWithMessage("successfully created").close();
    },

    "should add and remove an attachment": browser => {
      const caseDetailsPage = browser.page.CaseDetails();
      const snackbar = browser.page.SnackbarPOM();
      const imagesDir = "images/";
      const fileName = "dog_nose.jpg";

      caseDetailsPage
        .isOnPage()
        .attachFileWithName(fileName)
        .setDescription("a description")
        .uploadFile();

      snackbar.presentWithMessage("File was successfully attached").close();

      caseDetailsPage.removeFile().confirmRemoveAttachmentInDialog();

      snackbar.presentWithMessage("File was successfully removed").close();

      caseDetailsPage.thereAreNoAttachments();
    },

    "should open edit civilian form and set gender and race/ethnicity": browser => {
      const caseDetailsPage = browser.page.CaseDetails();
      const civilianDialog = browser.page.CivilianDialog();

      caseDetailsPage.editComplainant();
      civilianDialog
        .dialogIsOpen()
        .setGenderIdentity("Female")
        .setRaceEthnicity("Cuban"); //TODO: may need pause
    },

    "should display suggestions when text is entered": browser => {
      const civilianDialog = browser.page.CivilianDialog();

      civilianDialog.typeInAddress("6500").thereAreSuggestions();
    },

    "should complete suggestion but not select address when navigating through them": browser => {
      const civilianDialog = browser.page.CivilianDialog();
      civilianDialog
        .arrowDown()
        .addressSuggestionFieldPopulated()
        .addressFieldsAreEmpty();
    },

    "should select suggestion on enter/click": browser => {
      const civilianDialog = browser.page.CivilianDialog();

      civilianDialog.selectSuggestion().addressFieldsAreNotEmpty();
    },

    "should submit address": browser => {
      const civilianDialog = browser.page.CivilianDialog();
      const snackbar = browser.page.SnackbarPOM();

      civilianDialog.submitCivilianDialog();
      snackbar.presentWithMessage("Civilian was successfully updated").close();
    },

    "should display the address in the Complainant & Witnesses section of the Case Detail": browser => {
      browser.expect
        .element('p[data-test="civilianAddress"]')
        .text.to.not.equal("No address specified");
    },

    "should submit blank address when cleared and submitted": browser => {
      browser
        .waitForElementPresent("[data-test=editComplainantLink]", rerenderWait)
        .click("[data-test=editComplainantLink]")
        .waitForElementVisible("[data-test=editDialogTitle]", rerenderWait)
        .clearValue('[data-test="addressSuggestionField"] > input')
        .pause(1000)
        .setValue('[data-test="addressSuggestionField"] > input', [
          " ",
          browser.Keys.BACK_SPACE
        ])
        .pause(1000);

      browser.expect
        .element('[data-test="addressSuggestionField"] > input')
        .text.to.equal("");
      browser.expect
        .element('[data-test="streetAddressInput"]')
        .value.to.equal("");
      browser.expect.element('[data-test="cityInput"]').value.to.equal("");
      browser.expect.element('[data-test="stateInput"]').value.to.equal("");
      browser.expect.element('[data-test="zipCodeInput"]').value.to.equal("");
      browser.expect.element('[data-test="countryInput"]').value.to.equal("");

      browser
        .click('button[data-test="submitEditCivilian"]')
        .waitForElementPresent(
          '[data-test="sharedSnackbarBannerText"]',
          roundTripWait
        )
        .assert.containsText(
          '[data-test="sharedSnackbarBannerText"]',
          "Civilian was successfully updated"
        )
        .pause(1000);
    },

    "should not show address in Complainant & Witnesses section of Case Detail": browser => {
      browser
        .waitForElementPresent('p[data-test="civilianAddress"]', roundTripWait)
        .pause(1000);

      const expansionPanel = '[data-test="complainantWitnessesPanel"] > div';
      browser.getAttribute(expansionPanel, "aria-expanded", expanded => {
        if (!expanded) {
          browser.click(expansionPanel).pause(1000);
        }
      });

      browser.getText('p[data-test="civilianAddress"]', result => {
        browser.assert.containsText(
          'p[data-test="civilianAddress"]',
          result.value
        );
      });
    },

    "should open incident details": browser => {
      browser
        .waitForElementPresent(
          '[data-test="editIncidentDetailsButton"]',
          rerenderWait
        )
        .click('[data-test="editIncidentDetailsButton"]');
    },

    "should enter and fill intersection address into incident location": browser => {
      browser
        .setValue('[data-test="addressSuggestionField"] > input', [
          "canal st & bourbon st"
        ])
        .waitForElementPresent(
          '[data-test="saveIncidentDetailsButton"]',
          rerenderWait
        )
        .click('[data-test="saveIncidentDetailsButton"]')
        .waitForElementPresent(
          '[data-test="fillAddressToConfirm"]',
          rerenderWait
        )
        .click('[data-test="fillAddressToConfirm"]')
        .waitForElementPresent(
          '[data-test="saveIncidentDetailsButton"]',
          rerenderWait
        )
        .click('[data-test="saveIncidentDetailsButton"]');
    },

    "should display the incident location in the Incident Details section of the Case Detail": browser => {
      browser.pause(1000);
      browser.expect
        .element('[data-test="incidentLocation"]')
        .text.to.not.equal("No address specified");
    },

    "should navigate to Add Case Officer Page": browser => {
      browser
        .waitForElementVisible('[data-test="closeSnackbar"]', roundTripWait)
        .click('[data-test="closeSnackbar"]')
        .waitForElementVisible(
          '[data-test="addAccusedOfficerButton"]',
          rerenderWait
        )
        .pause(1000)
        .click('[data-test="addAccusedOfficerButton"]');
    },

    "should navigate to add officer form for unknown officer": browser => {
      const addOfficerSearchPage = browser.page.AddOfficerSearch();
      const addOfficerDetailsPage = browser.page.AddOfficerDetails();

      addOfficerSearchPage.isOnPage().clickUnknownOfficerLink();
      addOfficerDetailsPage
        .isOnPageForUnknownOfficer()
        .selectRole("Accused")
        .submitOfficer();
    },

    "should see Unknown Officer in Accused section when added": browser => {
      const caseDetailsPage = browser.page.CaseDetails();
      const snackbar = browser.page.SnackbarPOM();

      caseDetailsPage.isOnPage().thereIsAnUnknownOfficer();
      snackbar.presentWithMessage("Officer was successfully added").close();
    },

    "should see Edit Officer page when Edit Officer clicked": browser => {
      const caseDetailsPage = browser.page.CaseDetails();
      const editOfficerDetailsPage = browser.page.EditOfficerDetails();

      caseDetailsPage.clickManageUnknownOfficer().clickEditOfficer();

      editOfficerDetailsPage.isOnPageForUnknownOfficer().changeOfficer();
    },

    "should see Edit Officer search and search for officer to replace unknown": browser => {
      const editOfficerSearchPage = browser.page.EditOfficerSearch();

      editOfficerSearchPage
        .isOnPage()
        .setLastName("Ri")
        .searchForOfficer()
        .selectNewOfficer();
    },

    "should return to Edit Officer when new officer selected": browser => {
      const editOfficerDetailsPage = browser.page.EditOfficerDetails();

      editOfficerDetailsPage.isOnPageForKnownOfficer().saveOfficer();
    },

    "should see that officer is no longer unknown in accused officers": browser => {
      const caseDetailsPage = browser.page.CaseDetails();
      const snackbar = browser.page.SnackbarPOM();

      caseDetailsPage.isOnPage();
      snackbar.presentWithMessage("Officer was successfully updated").close();

      caseDetailsPage.thereIsAKnownOfficer("Ri");
    },

    "should add an allegation to the officer": browser => {
      const caseDetailsPage = browser.page.CaseDetails();
      const allegationPage = browser.page.Allegations();
      const snackbar = browser.page.SnackbarPOM();

      caseDetailsPage.clickManageKnownOfficer().clickManageAllegations();

      allegationPage
        .isOnPage()
        .setRule()
        .searchForAllegations()
        .selectAllegation()
        .setAllegationDetails("Used department property.")
        .setAllegationSeverity()
        .addAllegation()
        .newAllegationExists();

      snackbar.presentWithMessage("Allegation was successfully added").close();

      allegationPage.returnToCase();
    },

    "should navigate to Add Case Officer Page to add second officer": browser => {
      const caseDetailsPage = browser.page.CaseDetails();
      const addOfficerSearchPage = browser.page.AddOfficerSearch();

      caseDetailsPage.isOnPage().addAccusedOfficer();
      addOfficerSearchPage.isOnPage().clickUnknownOfficerLink();
    },

    "should navigate to add officer form for unknown second officer": browser => {
      const addOfficerDetailsPage = browser.page.AddOfficerDetails();

      addOfficerDetailsPage
        .isOnPageForUnknownOfficer()
        .selectRole("Accused")
        .submitOfficer();
    },

    "should see Unknown Second Officer in Accused section when added": browser => {
      const caseDetailsPage = browser.page.CaseDetails();
      const snackbar = browser.page.SnackbarPOM();

      caseDetailsPage.isOnPage().thereIsAnUnknownOfficer();
      snackbar.presentWithMessage("Officer was successfully added").close();
    },

    "should not see officer on case when removed": browser => {
      const caseDetailsPage = browser.page.CaseDetails();
      const snackbar = browser.page.SnackbarPOM();

      caseDetailsPage
        .clickManageUnknownOfficer()
        .clickRemoveOfficer()
        .confirmRemoveOfficerInDialog();

      snackbar.presentWithMessage("Officer was successfully removed").close();

      caseDetailsPage.thereIsNoUnknownOfficer();
    },

    "should open begin letter in progress dialog to begin letter": browser => {
      const caseDetails = browser.page.CaseDetails();
      const caseReview = browser.page.CaseReview();
      const snackbar = browser.page.SnackbarPOM();

      caseDetails.beginLetter().confirmBeginLetterInDialog();

      caseReview.isOnPage();

      snackbar.presentWithMessage("Status was successfully updated").close();

      caseReview.clickNext();
    },

    "should advance to officer complaint history and add allegations": browser => {
      const caseReview = browser.page.CaseReview();
      const snackbar = browser.page.SnackbarPOM();
      const complaintHistory = browser.page.ComplaintHistory();

      complaintHistory
        .isOnPage()
        .setHighAllegations(2)
        .setMedAllegations(3)
        .setLowAllegations(5)
        .clickNext();

      snackbar
        .presentWithMessage(
          "Officer complaint history was successfully updated"
        )
        .close();
    },

    "should remove and add iapro correction": browser => {
      const iaproCorrections = browser.page.IAProCorrections();

      iaproCorrections
        .isOnPage()
        .setNthDetails(0, "IAPro Correction Details")
        .setNthDetails(1, "Details to delete")
        .removeNthCorrection(1)
        .expectNthCorrectionValue(0, "IAPro Correction Details")
        .expectNthCorrectionValue(1, "")
        .addCorrection()
        .waitForElementPresent(
          '[name="referralLetterIAProCorrections[2].details"]',
          rerenderWait
        );

      browser.pause(2000);

      iaproCorrections.clickNext();
    },

    "should check retaliation concerns and recommended action": browser => {
      const recommendedActions = browser.page.RecommendedActions();
      const snackbar = browser.page.SnackbarPOM();

      recommendedActions.isOnPage();

      snackbar
        .presentWithMessage("IAPro corrections were successfully updated")
        .close();

      recommendedActions
        .toggleRetaliationConcerns()
        .toggleNthOfficersNthRecommendedAction(0, 1)
        .clickNext();
    },

    "should advance to letter preview and check letter contents": browser => {
      const letterPreview = browser.page.LetterPreview();
      const snackbar = browser.page.SnackbarPOM();

      snackbar
        .presentWithMessage("Recommended actions were successfully updated")
        .close();

      letterPreview
        .isOnPage()
        .letterContains("Name: Night Watch")
        .letterContains("Name: Ansel W Rice")
        .letterContains(
          "Location: Bourbon St & Canal St, New Orleans, LA 70112"
        )
        .letterContains(
          "10 total complaints including 2 HIGH RISK allegations, 3 MEDIUM RISK allegations, 5 LOW RISK allegations"
        )
        .letterContains(
          "Retaliation Concerns and Request for Notice to Officer(s)"
        )
        .letterContains(
          "Be temporarily or permanently reassigned from his/her current assignment"
        );
    },

    "should edit letter": browser => {
      const letterPreview = browser.page.LetterPreview();
      const editLetter = browser.page.EditLetter();
      const snackbar = browser.page.SnackbarPOM();

      letterPreview.clickEditLetter().confirmEditLetterOnDialog();
      editLetter.isOnPage();
      snackbar.presentWithMessage("Letter was successfully updated").close();

      browser.click(".ql-editor").keys("This text is edited");

      editLetter.saveEdits();

      letterPreview
        .isOnPage()
        .waitForData()
        .letterContains("This text is edited");

      snackbar.presentWithMessage("Letter was successfully updated").close();
    },

    "should submit for review": browser => {
      const letterPreview = browser.page.LetterPreview();
      const caseDetails = browser.page.CaseDetails();
      const snackbar = browser.page.SnackbarPOM();

      letterPreview.clickSubmit().confirmSubmit();
      caseDetails.isOnPage();
      snackbar.presentWithMessage("Status was successfully updated").close();
    },

    "should log out of the system": browser => {
      const logoutPage = browser.page.Logout();
      const loginPage = browser.page.Login();
      logoutPage.clickGearButton().clickLogout();
      loginPage.isOnPage();
    },

    "end user journey ;)": browser => {
      browser.end();
    }
  };
}
