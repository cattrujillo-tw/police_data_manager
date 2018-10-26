import models from "../../../models/index";
import shortid from "shortid";
import { ACCUSED } from "../../../../sharedUtilities/constants";

const getLetterDataForResponse = async caseId => {
  let letterData = await getLetterData(caseId);
  letterData = letterData.toJSON();

  const transformedLetterOfficerData = letterData.caseOfficers.map(
    caseOfficer => {
      return {
        caseOfficerId: caseOfficer.id,
        fullName: caseOfficer.fullName,
        ...letterOfficerAttributes(caseOfficer)
      };
    }
  );
  const transformedLetterData = {
    id: letterData.id,
    caseId: letterData.caseId,
    includeRetaliationConcerns: letterData.includeRetaliationConcerns,
    referralLetterOfficers: transformedLetterOfficerData,
    referralLetterIAProCorrections: getIAProCorrections(letterData)
  };

  return transformedLetterData;
};

const getIAProCorrections = letterData => {
  return letterData.referralLetterIAProCorrections.length === 0
    ? buildEmptyIAProCorrections()
    : letterData.referralLetterIAProCorrections;
};

const letterOfficerAttributes = caseOfficer => {
  const letterOfficerAttributes = caseOfficer.referralLetterOfficer || {};
  if (
    !letterOfficerAttributes.referralLetterOfficerHistoryNotes ||
    letterOfficerAttributes.referralLetterOfficerHistoryNotes.length === 0
  ) {
    letterOfficerAttributes.referralLetterOfficerHistoryNotes = buildEmptyNotes();
  }
  letterOfficerAttributes.referralLetterOfficerRecommendedActions = buildRecommendedActions(
    letterOfficerAttributes.referralLetterOfficerRecommendedActions
  );

  return letterOfficerAttributes;
};

const buildRecommendedActions = recommendedActions => {
  if (!recommendedActions) {
    return [];
  }
  return recommendedActions.map(action => action.recommendedActionId);
};

const emptyObject = () => ({ tempId: shortid.generate() });

const buildEmptyNotes = () => {
  return [emptyObject()];
};

const buildEmptyIAProCorrections = () => {
  return [emptyObject(), emptyObject(), emptyObject()];
};

const getLetterData = async caseId => {
  return await models.referral_letter.findOne({
    where: { caseId: caseId },
    attributes: ["id", "caseId", "includeRetaliationConcerns"],
    order: [
      [{ model: models.case_officer, as: "caseOfficers" }, "created_at", "ASC"],
      [
        {
          model: models.referral_letter_iapro_correction,
          as: "referralLetterIAProCorrections"
        },
        "created_at",
        "ASC"
      ]
    ],
    include: [
      {
        model: models.referral_letter_iapro_correction,
        as: "referralLetterIAProCorrections",
        attributes: ["id", "details"]
      },
      {
        model: models.case_officer,
        as: "caseOfficers",
        where: { roleOnCase: ACCUSED },
        attributes: ["id", "officerId", "firstName", "middleName", "lastName"], //must include officerId or will be named unknown officer
        include: [
          {
            model: models.referral_letter_officer,
            as: "referralLetterOfficer",
            attributes: [
              "id",
              "caseOfficerId",
              "historicalBehaviorNotes",
              "numHistoricalHighAllegations",
              "numHistoricalMedAllegations",
              "numHistoricalLowAllegations",
              "recommendedActionNotes"
            ],
            include: [
              {
                model: models.referral_letter_officer_recommended_action,
                as: "referralLetterOfficerRecommendedActions",
                attributes: ["recommendedActionId", "referralLetterOfficerId"],
                separate: true
              },
              {
                model: models.referral_letter_officer_history_note,
                as: "referralLetterOfficerHistoryNotes",
                attributes: [
                  "id",
                  "referralLetterOfficerId",
                  "pibCaseNumber",
                  "details"
                ],
                separate: true
              }
            ]
          }
        ]
      }
    ]
  });
};

export default getLetterDataForResponse;
