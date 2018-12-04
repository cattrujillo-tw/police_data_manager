import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../models";
import {
  AUDIT_SUBJECT,
  CASE_STATUS,
  CIVILIAN_INITIATED
} from "../../../../../sharedUtilities/constants";
import generateLetterPdfBuffer from "../sharedReferralLetterUtilities/generateLetterPdfBuffer";
import uploadLetterToS3 from "./uploadLetterToS3";
import Boom from "boom";
import checkFeatureToggleEnabled from "../../../../checkFeatureToggleEnabled";
import auditUpload from "./auditUpload";
import constructFilename from "./constructFilename";

const approveLetter = asyncMiddleware(async (request, response, next) => {
  const caseId = request.params.caseId;

  const includeSignature = checkFeatureToggleEnabled(
    request,
    "letterSignatureFeature"
  );

  await models.sequelize.transaction(async transaction => {
    const existingCase = await models.cases.findById(request.params.caseId, {
      include: [
        {
          model: models.case_officer,
          as: "complainantOfficers",
          auditUser: "test"
        },
        {
          model: models.civilian,
          as: "complainantCivilians",
          auditUser: "test"
        }
      ]
    });

    validateCaseStatus(existingCase);
    const firstComplainant =
      existingCase.complaintType === CIVILIAN_INITIATED
        ? existingCase.complainantCivilians[0]
        : existingCase.complainantOfficers[0];

    const complainantLastName = firstComplainant
      ? firstComplainant.lastName
      : "";

    await generateLetterAndUploadToS3(
      caseId,
      existingCase.caseNumber,
      existingCase.firstContactDate,
      complainantLastName,
      includeSignature,
      transaction,
      request.nickname
    );
    await auditUpload(
      request.nickname,
      caseId,
      AUDIT_SUBJECT.REFERRAL_LETTER_PDF,
      transaction
    );

    await transitionCaseToForwardedToAgency(existingCase, request, transaction);
  });
  response.status(200).send();
});

const validateCaseStatus = existingCase => {
  if (existingCase.status !== CASE_STATUS.READY_FOR_REVIEW) {
    throw Boom.badRequest("Invalid case status");
  }
};

const generateLetterAndUploadToS3 = async (
  caseId,
  caseNumber,
  firstContactDate,
  firstComplainantLastName,
  includeSignature,
  transaction,
  auditUser
) => {
  const generatedReferralLetterPdf = await generateLetterPdfBuffer(
    caseId,
    includeSignature,
    transaction
  );

  const filename = constructFilename(
    caseId,
    caseNumber,
    firstContactDate,
    firstComplainantLastName
  );

  await uploadLetterToS3(
    caseId,
    caseNumber,
    firstContactDate,
    firstComplainantLastName,
    generatedReferralLetterPdf
  );

  await saveFilename(filename, caseId, auditUser, transaction);
};

const transitionCaseToForwardedToAgency = async (
  existingCase,
  request,
  transaction
) => {
  await existingCase.update(
    { status: CASE_STATUS.FORWARDED_TO_AGENCY },
    { auditUser: request.nickname, transaction }
  );
};

const saveFilename = async (filename, caseId, auditUser, transaction) => {
  const referralLetter = await models.referral_letter.find({
    where: { caseId: caseId }
  });
  await referralLetter.update(
    { finalPdfFilename: filename },
    { auditUser: auditUser, transaction }
  );
};

export default approveLetter;
