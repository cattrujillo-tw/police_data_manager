import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../../testHelpers/requestTestHelpers";
import Case from "../../../../../client/testUtilities/case";
import models from "../../../../models";
import { CASE_STATUS } from "../../../../../sharedUtilities/constants";
import ReferralLetter from "../../../../../client/testUtilities/ReferralLetter";
import CaseOfficer from "../../../../../client/testUtilities/caseOfficer";
import LetterOfficer from "../../../../../client/testUtilities/LetterOfficer";
import Officer from "../../../../../client/testUtilities/Officer";
import app from "../../../../server";
import request from "supertest";

jest.mock("../../export/jobQueue");

describe("Generate referral letter pdf", () => {
  let existingCase, referralLetter, letterOfficer, token;

  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(async () => {
    token = buildTokenWithPermissions("", "some_nickname");
    const caseAttributes = new Case.Builder().defaultCase().withId(undefined);
    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "test"
    });

    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined);
    const officer = await models.officer.create(officerAttributes, {
      auditUser: "test"
    });

    const caseOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withCaseId(existingCase.id)
      .withOfficerId(officer.id);
    const caseOfficer = await models.case_officer.create(
      caseOfficerAttributes,
      {
        auditUser: "test"
      }
    );

    await existingCase.update(
      { status: CASE_STATUS.ACTIVE },
      { auditUser: "test" }
    );
    await existingCase.update(
      { status: CASE_STATUS.LETTER_IN_PROGRESS },
      { auditUser: "test" }
    );

    const letterOfficerAttributes = new LetterOfficer.Builder()
      .defaultLetterOfficer()
      .withId(undefined)
      .withCaseOfficerId(caseOfficer.id);
    letterOfficer = await models.letter_officer.create(
      letterOfficerAttributes,
      {
        auditUser: "test"
      }
    );

    const referralLetterAttributes = new ReferralLetter.Builder()
      .defaultReferralLetter()
      .withId(undefined)
      .withCaseId(existingCase.id)
      .withRecipient("recipient address")
      .withSender("sender address")
      .withTranscribedBy("transcriber")
      .withIncludeRetaliationConcerns(true);

    referralLetter = await models.referral_letter.create(
      referralLetterAttributes,
      {
        auditUser: "test"
      }
    );
  });

  test("returns letter pdf blob", async () => {
    await request(app)
      .get(`/api/cases/${existingCase.id}/referral-letter/get-pdf`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(response => {
        expect(response.body.length > 0).toBeTruthy();
      });
  });
});