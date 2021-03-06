import models from "../policeDataManager/models";

export const transformReferralLetterAttachmentsIfComplainantAnonymous = async (
  attachments,
  transaction
) => {
  for (let i = 0; i < attachments.length; i++) {
    const fileName = attachments[i].fileName;
    const fileParts = fileName.split("_");
    const firstContactDate = fileParts[0];
    const caseReference = fileParts[1];

    if (
      attachments[i].description === "Referral Letter" &&
      caseReference.startsWith("AC")
    ) {
      const newFilename = `${firstContactDate}_${caseReference}_PIB_Referral_Anonymous.pdf`;
      await updateFilenameDB(attachments[i], newFilename);
    }
  }
};

export const reverseTransformReferralLetterAttachmentsIfComplainantAnonymous = async (
  attachments,
  transaction
) => {
  for (let i = 0; i < attachments.length; i++) {
    const caseId = attachments[i].caseId;

    const attachmentCase = await models.cases.findByPk(caseId, {
      attributes: ["caseReference", "year", "caseNumber", "primaryComplainant"],
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          attributes: ["isAnonymous", "lastName", "createdAt"]
        },
        {
          model: models.case_officer,
          as: "complainantOfficers",
          attributes: [
            "isAnonymous",
            "lastName",
            "caseEmployeeType",
            "createdAt",
            "officerId"
          ]
        }
      ],
      paranoid: false
    });

    const fileName = attachments[i].fileName;
    const fileParts = fileName.split("_");
    const firstContactDate = fileParts[0];
    const caseReference = fileParts[1];
    const anonymousPortion = fileParts[4];
    const lastname = attachmentCase.primaryComplainant.lastName;

    if (
      attachments[i].description === "Referral Letter" &&
      caseReference.startsWith("AC") &&
      anonymousPortion === "Anonymous.pdf"
    ) {
      const newFilename = `${firstContactDate}_${caseReference}_PIB_Referral_${lastname}.pdf`;
      await updateFilenameDB(attachments[i], newFilename);
    }
  }
};

const updateFilenameDB = async (attachment, newFilename) => {
  await attachment.update(
    { fileName: newFilename },
    { auditUser: "migration to update anonymous complainant filenames" }
  );
};
