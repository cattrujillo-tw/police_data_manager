import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import { getCaseWithAllAssociationsAndAuditDetails } from "../../getCaseHelpers";
import auditDataAccess from "../../audits/auditDataAccess";
import { sendNotifsIfComplainantChange } from "../../sendNotifsIfComplainantChange";

const models = require("../../../policeDataManager/models");
const asyncMiddleware = require("../../asyncMiddleware");
const Boom = require("boom");
const {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} = require("../../../../sharedUtilities/constants");

const removeCaseOfficer = asyncMiddleware(async (request, response, next) => {
  const officerToRemove = await models.case_officer.findByPk(
    request.params.caseOfficerId
  );

  if (officerToRemove === null) {
    next(Boom.badRequest(BAD_REQUEST_ERRORS.REMOVE_CASE_OFFICER_ERROR));
  }

  const updatedCase = await models.sequelize.transaction(async transaction => {
    await officerToRemove.destroy({
      auditUser: request.nickname,
      transaction
    });

    const caseDetailsAndAuditDetails = await getCaseWithAllAssociationsAndAuditDetails(
      request.params.caseId,
      transaction
    );
    const caseDetails = caseDetailsAndAuditDetails.caseDetails;
    const auditDetails = caseDetailsAndAuditDetails.auditDetails;

    await auditDataAccess(
      request.nickname,
      request.params.caseId,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.CASE_DETAILS,
      auditDetails,
      transaction
    );

    return caseDetails;
  });

  response.status(200).send(updatedCase);

  await sendNotifsIfComplainantChange(updatedCase.id);
});

module.exports = removeCaseOfficer;
