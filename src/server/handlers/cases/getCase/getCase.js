const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models");
const {
  DATA_VIEWED,
  AUDIT_TYPE
} = require("../../../../sharedUtilities/constants");

const getCase = asyncMiddleware(async (req, res) => {
  const singleCase = await models.sequelize.transaction(async transaction => {
    await models.action_audit.create(
      {
        user: req.nickname,
        caseId: req.params.id,
        action: DATA_VIEWED,
        auditType: AUDIT_TYPE.PAGE_VIEW
        //TEST THIS BEFORE COMMIT
      },
      { transaction }
    );
    const caseWithAssociations = await getCaseWithAllAssociations(
      req.params.id,
      transaction
    );
    return caseWithAssociations;
  });

  res.send(singleCase);
});

module.exports = getCase;
