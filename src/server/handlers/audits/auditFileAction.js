import models from "../../models";

export const auditFileAction = async (
  user,
  caseId,
  auditAction,
  fileName,
  fileType,
  transaction
) => {
  const auditValues = {
    auditAction: auditAction,
    user: user,
    caseId: caseId,
    fileAudit: {
      fileName: fileName,
      fileType: fileType
    }
  };

  await models.audit.create(auditValues, {
    include: [
      {
        as: "fileAudit",
        model: models.file_audit
      }
    ],
    transaction
  });
};