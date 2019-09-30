import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../models";
import generateReferralLetterPdfBuffer from "./generateReferralLetterPdfBuffer";
import throwErrorIfLetterFlowUnavailable from "../throwErrorIfLetterFlowUnavailable";
import { AUDIT_SUBJECT } from "../../../../../sharedUtilities/constants";
import auditDataAccess from "../../../audits/auditDataAccess";

const getReferralLetterPdf = asyncMiddleware(
  async (request, response, next) => {
    const caseId = request.params.caseId;
    await throwErrorIfLetterFlowUnavailable(caseId);
    await models.sequelize.transaction(async transaction => {
      const pdfBufferAndAuditDetails = await generateReferralLetterPdfBuffer(
        caseId,
        false,
        transaction
      );

      const pdfBuffer = pdfBufferAndAuditDetails.pdfBuffer;
      const auditDetails = pdfBufferAndAuditDetails.auditDetails;

      await auditDataAccess(
        request.nickname,
        caseId,
        AUDIT_SUBJECT.DRAFT_REFERRAL_LETTER_PDF,
        auditDetails,
        transaction
      );

      response.send(pdfBuffer);
    });
  }
);

export default getReferralLetterPdf;
