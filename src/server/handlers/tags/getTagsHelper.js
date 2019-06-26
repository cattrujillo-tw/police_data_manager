import getQueryAuditAccessDetails from "../audits/getQueryAuditAccessDetails";
import models from "../../models";
import { ASCENDING } from "../../../sharedUtilities/constants";
import { caseInsensitiveSort } from "../sequelizeHelpers";

const getTagsAndAuditDetails = async transaction => {
  const queryOptions = {
    order: [[caseInsensitiveSort("name", models.tag), ASCENDING]],
    transaction
  };
  const tagObjects = await models.tag.findAll(queryOptions);
  const auditDetails = getQueryAuditAccessDetails(
    queryOptions,
    models.tag.name
  );

  const tags = tagObjects.map(tag => {
    return [tag.name, tag.id];
  });

  return { tags: tags, auditDetails: auditDetails };
};

export default getTagsAndAuditDetails;