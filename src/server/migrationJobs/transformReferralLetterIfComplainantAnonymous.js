import moment from "moment";

const createConfiguredS3Instance = require("../../../createConfiguredS3Instance");
export const transformReferralLetterIfComplainantAnonymous = async (
  referralLetters,
  transaction
) => {
  const s3 = createConfiguredS3Instance();
  for (let i = 0; i < referralLetters.length; i++) {
    const caseId = referralLetters[i].caseId;
    const letterCase = await models.cases.findByPk(caseId, {
      attributes: [
        "firstContactDate",
        "primaryComplainant",
        "caseReference",
        "year",
        "caseNumber"
      ],
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          attributes: ["isAnonymous", "createdAt"]
        },
        {
          model: models.case_officer,
          as: "complainantOfficers",
          attributes: [
            "isAnonymous",
            "caseEmployeeType",
            "createdAt",
            "officerId"
          ]
        }
      ]
    });
    const primaryComplainant = letterCase.get("primaryComplainant");

    if (primaryComplainant.isAnonymous) {
      const newFilename = updateFilename(
        letterCase.firstContactDate,
        letterCase.caseReference
      );
      copyAndDeleteObjectS3(
        letterCase.id,
        referralLetters[i].finalPdfFilename,
        newFilename,
        s3
      );
      await updateFilenameDB(referralLetters[i], newFilename);
    }
  }
};

const updateFilename = (firstContactDate, caseReference) => {
  const formattedFirstContactDate = moment(firstContactDate).format("M-D-YYYY");

  const newFilename = `${formattedFirstContactDate}_${caseReference}_PIB_Referral_Anonymous.pdf`;

  return newFilename;
};

const copyAndDeleteObjectS3 = (caseId, oldFilename, newFilename, s3) => {
  // copy object in same bucket with the new filename

  // delete the original object with the oldname

  try {
    s3.deleteObject({
      Bucket: config[process.env.NODE_ENV].referralLettersBucket,
      Key: `${caseId}/${oldFilename}`
    });
  } catch (error) {
    console.log(error);
  }
};

const updateFilenameDB = async (referralLetter, newFilename) => {
  await referralLetter.update(
    { finalPdfFilename: newFilename },
    { auditUser: "migration to update anonymous complainant filenames" }
  );
};
