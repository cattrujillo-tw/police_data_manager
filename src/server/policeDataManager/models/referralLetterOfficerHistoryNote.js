const models = "./";
const letter_officers = require("./letterOfficer");
module.exports = (sequelize, DataTypes) => {
  const ReferralLetterOfficerHistoryNotes = sequelize.define(
    "referral_letter_officer_history_note",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      referralLetterOfficerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "referral_letter_officer_id",
        references: {
          model: letter_officers,
          key: "id"
        }
      },
      pibCaseNumber: {
        type: DataTypes.STRING,
        field: "pib_case_number"
      },
      details: {
        type: DataTypes.TEXT
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: "created_at"
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: "updated_at"
      },
      deletedAt: {
        type: DataTypes.DATE,
        field: "deleted_at"
      }
    },
    { tableName: "referral_letter_officer_history_notes", paranoid: true }
  );

  ReferralLetterOfficerHistoryNotes.associate = models => {
    ReferralLetterOfficerHistoryNotes.belongsTo(models.letter_officer, {
      as: "letterOfficer",
      foreignKey: {
        name: "letterOfficerId",
        field: "letter_officer_id",
        allowNull: false
      }
    });
  };

  ReferralLetterOfficerHistoryNotes.prototype.getCaseId = async function (
    transaction
  ) {
    const letterOfficer = await sequelize
      .model("letter_officer")
      .findByPk(this.referralLetterOfficerId, {
        include: [
          {
            model: sequelize.model("case_officer"),
            as: "caseOfficer"
          }
        ],
        transaction
      });
    return letterOfficer.caseOfficer.caseId;
  };

  ReferralLetterOfficerHistoryNotes.prototype.getManagerType = async function (
    transaction
  ) {
    return "complaint";
  };

  ReferralLetterOfficerHistoryNotes.prototype.modelDescription =
    async function (transaction) {
      const letterOfficer = await sequelize
        .model("letter_officer")
        .findByPk(this.referralLetterOfficerId, {
          include: [
            {
              model: sequelize.model("case_officer"),
              as: "caseOfficer"
            }
          ],
          transaction
        });
      return [{ "Officer Name": letterOfficer.caseOfficer.fullName }];
    };

  ReferralLetterOfficerHistoryNotes.auditDataChange();
  return ReferralLetterOfficerHistoryNotes;
};
