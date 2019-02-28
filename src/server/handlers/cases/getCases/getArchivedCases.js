import models from "../../../models";
import asyncMiddleware from "../../asyncMiddleware";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../../sharedUtilities/constants";
import auditDataAccess from "../../auditDataAccess";
import getCases, { CASES_TYPE } from "./getCases";

const getArchivedCases = asyncMiddleware(async (req, res) => {
  const cases = await models.sequelize.transaction(async transaction => {
    let auditDetails = {};

    const archivedCases = await getCases(
      CASES_TYPE.ARCHIVED,
      transaction,
      auditDetails
    );

    await auditDataAccess(
      req.nickname,
      undefined,
      AUDIT_SUBJECT.ALL_ARCHIVED_CASES,
      transaction,
      AUDIT_ACTION.DATA_ACCESSED,
      auditDetails
    );

    return archivedCases;
  });

  res.status(200).send({ cases });
});

export default getArchivedCases;