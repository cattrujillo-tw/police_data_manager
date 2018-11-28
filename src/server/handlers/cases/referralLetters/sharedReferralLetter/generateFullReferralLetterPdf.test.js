import { generateLetterPdfHtml } from "./generateFullReferralLetterPdf";
import timekeeper from "timekeeper";
import Case from "../../../../../client/testUtilities/case";
import ReferralLetter from "../../../../../client/testUtilities/ReferralLetter";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import generateReferralLetterFromCaseData from "../generateReferralLetterFromCaseData";
import models from "../../../../models";
import {
  CASE_STATUS,
  CIVILIAN_INITIATED
} from "../../../../../sharedUtilities/constants";
import generateFullReferralLetterPdf from "./generateFullReferralLetterPdf";

jest.mock("html-pdf", () => ({
  create: (html, pdfOptions) => ({
    toBuffer: callback => {
      callback(null, html);
    }
  })
}));

jest.mock("../generateReferralLetterFromCaseData");

describe("generateFullReferralLetterPdf", () => {
  let existingCase, referralLetter, timeOfDownload;

  afterEach(async () => {
    await cleanupDatabase();
    generateReferralLetterFromCaseData.mockReset();
  });

  beforeEach(async () => {
    timeOfDownload = new Date("2018-07-01 19:00:22 CDT");
    timekeeper.freeze(timeOfDownload);
    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(12070)
      .withFirstContactDate("2017-12-25")
      .withIncidentDate("2016-01-01")
      .withComplaintType(CIVILIAN_INITIATED);
    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "test"
    });
    await existingCase.update(
      { status: CASE_STATUS.ACTIVE },
      { auditUser: "test" }
    );
    await existingCase.update(
      { status: CASE_STATUS.LETTER_IN_PROGRESS },
      { auditUser: "test" }
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

  afterEach(() => {
    timekeeper.reset();
  });

  test("generates letter pdf html correctly", async () => {
    const letterBody = "<p> Letter Body </p>";
    const pdfData = {
      referralLetter: {
        recipient: "Recipient Address",
        sender: "Sender Address\n Sender Address Second Line",
        transcribedBy: "Transcriber"
      },
      caseNumber: "CC-2011-0099"
    };

    const letterPdfHtml = await generateLetterPdfHtml(letterBody, pdfData);
    expect(letterPdfHtml).toMatchSnapshot();
  });

  test("pdf create gets called with expected letter html when letter is generated", async () => {
    await models.sequelize.transaction(async transaction => {
      const pdfResults = await generateFullReferralLetterPdf(
        existingCase.id,
        transaction
      );
      expect(pdfResults).toMatchSnapshot();
    });
  });

  test("pdf create gets called with expected letter html when letter is edited", async () => {
    await referralLetter.update(
      { editedLetterHtml: "Custom Letter HTML" },
      { auditUser: "someone" }
    );
    await models.sequelize.transaction(async transaction => {
      const pdfResults = await generateFullReferralLetterPdf(
        existingCase.id,
        transaction
      );
      expect(pdfResults).toMatchSnapshot();
    });
  });

  test("unedited letter generates pdf from case data", async () => {
    await models.sequelize.transaction(async transaction => {
      await generateFullReferralLetterPdf(existingCase.id, transaction);
      expect(generateReferralLetterFromCaseData).toHaveBeenCalledWith(
        existingCase.id,
        transaction
      );
    });
  });

  test("edited letter generates pdf from saved data", async () => {
    await referralLetter.update(
      {
        editedLetterHtml: "<p> edited </p>"
      },
      { auditUser: "test" }
    );
    await models.sequelize.transaction(async transaction => {
      await generateFullReferralLetterPdf(existingCase.id, transaction);
    });
    expect(generateReferralLetterFromCaseData).not.toHaveBeenCalled();
  });
});
