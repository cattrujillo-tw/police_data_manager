import models from "../../policeDataManager/models";

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
    referenceId: caseId,
    managerType: "complaint",
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
