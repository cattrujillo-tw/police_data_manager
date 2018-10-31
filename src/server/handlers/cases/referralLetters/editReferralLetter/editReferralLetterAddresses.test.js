import ReferralLetter from "../../../../../client/testUtilities/ReferralLetter";
import models from "../../../../models/index";
import editReferralLetterAddresses from "./editReferralLettersAddresses";
import httpMocks from "node-mocks-http";
import Case from "../../../../../client/testUtilities/case";

describe("Edit referral letter addresses", () => {
  test("update existing referral letter recipient, sender and transcribed by", async () => {
    const caseAttributes = new Case.Builder().defaultCase().withId(undefined);
    const existingCase = await models.cases.create(caseAttributes, {
      auditUser: "test"
    });
    const referralLetterAttribute = new ReferralLetter.Builder()
      .defaultReferralLetter()
      .withId(undefined)
      .withCaseId(existingCase.id);
    const existingReferralLetter = await models.referral_letter.create(
      referralLetterAttribute,
      { auditUser: "user" }
    );

    const requestBody = {
      recipient: "some recipient",
      sender: "some sender",
      transcribedBy: "some transcriber"
    };

    const request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer token"
      },
      params: { referralLetterId: existingReferralLetter.id },
      body: requestBody,
      nickname: "nickname"
    });

    const response = httpMocks.createResponse();
    await editReferralLetterAddresses(request, response, () => {});

    await existingReferralLetter.reload();

    expect(existingReferralLetter.recipient).toEqual(requestBody.recipient);
    expect(existingReferralLetter.sender).toEqual(requestBody.sender);
    expect(existingReferralLetter.transcribedBy).toEqual(
      requestBody.transcribedBy
    );
  });
});
