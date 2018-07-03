const { AUDIT_TYPE } = require("../../../sharedUtilities/constants");
const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models/index");
const allowedAuditActions = ["Logged In", "Logged Out", "System Log Exported"];

const audit = asyncMiddleware(async (request, response) => {
  if (!allowedAuditActions.includes(request.body.log)) {
    return response.sendStatus(400);
  }

  await models.action_audit.create({
    auditType: AUDIT_TYPE.AUTHENTICATION,
    action: request.body.log,
    caseId: null,
    user: request.nickname
  });

  response.status(201).send();
});

module.exports = audit;
