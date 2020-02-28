import auditDataAccess from "../../audits/auditDataAccess";
import getQueryAuditAccessDetails from "../../audits/getQueryAuditAccessDetails";
import { MANAGER_TYPE } from "../../../../sharedUtilities/constants";
import Boom from "boom";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import { createNotification } from "../helpers/caseNoteHelpers";

const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../complaintManager/models");
const _ = require("lodash");

const editCaseNote = asyncMiddleware(async (request, response, next) => {
  const { mentionedUsers, ...requestBody } = request.body;
  const caseId = request.params.caseId;
  const caseNoteId = request.params.caseNoteId;
  const valuesToUpdate = _.pick(request.body, [
    "caseNoteActionId",
    "actionTakenAt",
    "notes"
  ]);

  const caseNotes = await models.sequelize.transaction(async transaction => {
    await models.case_note.update(valuesToUpdate, {
      where: {
        id: caseNoteId
      },
      transaction,
      auditUser: request.nickname
    });

    await createNotification(mentionedUsers, requestBody, caseNoteId).catch(
      () => {
        throw Boom.badData(BAD_REQUEST_ERRORS.NOTIFICATION_CREATION_ERROR);
      }
    );

    const accessQueryOptions = {
      where: { caseId },
      include: [{ model: models.case_note_action, as: "caseNoteAction" }],
      transaction
    };

    const caseNotes = await models.case_note.findAll(accessQueryOptions);

    const caseNoteAuditDetails = getQueryAuditAccessDetails(
      accessQueryOptions,
      models.case_note.name
    );

    await auditDataAccess(
      request.nickname,
      caseId,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.CASE_NOTES,
      caseNoteAuditDetails,
      transaction
    );

    return caseNotes;
  });

  response.status(200).send(caseNotes);
});

module.exports = editCaseNote;
