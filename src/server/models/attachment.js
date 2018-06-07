"use strict";
module.exports = (sequelize, DataTypes) => {
  const Attachment = sequelize.define("attachment", {
    fileName: {
      field: "file_name",
      type: DataTypes.STRING
    },
    description: {
      field: "description",
      type: DataTypes.STRING
    },
    createdAt: {
      field: "created_at",
      type: DataTypes.DATE
    },
    updatedAt: {
      field: "updated_at",
      type: DataTypes.DATE
    }
  });

  Attachment.prototype.modelDescription = async (instance, options) => {
    return instance.fileName;
  };
  Attachment.associate = models => {
    Attachment.belongsTo(models.cases, {
      foreignKey: { name: "caseId", field: "case_id", allowNull: false }
    });
  };

  Attachment.auditDataChange();

  return Attachment;
};
