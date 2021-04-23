// UserJourney.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test
describe("Happy Path", () => {
  it("Creates a case and adds a tag", () => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit("https://localhost");
    // cy.get('.auth0-lock-input-email > .auth0-lock-input-wrap > .auth0-lock-input').should(($email) => {
    //     console.log("email", $email);
    //     if($email.length == 0) {

    //     }

    // });
    // cy.get('.auth0-lock-input-email > .auth0-lock-input-wrap > .auth0-lock-input').type("noipm.infrastructure@gmail.com");
    // cy.get('.auth0-lock-input-show-password > .auth0-lock-input-block > .auth0-lock-input-wrap > .auth0-lock-input').type("q7{%i@erUWpbD&}9hp2tmhXchh72YL", {parseSpecialCharSequences: false});
    // cy.get(".auth0-label-submit").click();
    cy.get(".MuiButton-label").click();
    cy.get("[data-testid=intakeSourceInput]").click();
    cy.get("[data-testid=intakeSourceInput]").type("{downarrow}");
    cy.get("[data-testid=intakeSourceInput]").type("{downarrow}");
    cy.get("[data-testid=intakeSourceInput]").type("{enter}");
    cy.get("[data-testid=firstNameInput]").click();
    cy.get("[data-testid=firstNameInput]").type("John");
    cy.get("[data-testid=lastNameInput]").type("Smith");
    cy.get("[data-testid=phoneNumberInput]").type("(112) 334-4555");
    //cy.get('[data-testid="createAndVie"]').click();
    cy.get("[data-testid=createAndView] > .MuiButton-label").click();
    cy.get('[data-testid="addTagButton"] > .MuiButton-label').click();
    cy.get("[data-testid=caseTagDropdownInput]").click();
    cy.get("[data-testid=caseTagDropdownInput]").type("{downarrow}");
    cy.get("[data-testid=caseTagDropdownInput]").type("{enter}");
    cy.get('[data-testid="caseTagSubmitButton"] > .MuiButton-label').click();
  });
});
