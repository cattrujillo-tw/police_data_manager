"use strict";
import models from "../complaintManager/models";
import { transformReferralLetterIfComplainantAnonymous } from "../migrationJobs/transformReferralLetterIfComplainantAnonymous";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      const referralLetters = await models.referral_letter.findAll({});

      try {
        await transformReferralLetterIfComplainantAnonymous(
          referralLetters,
          transaction
        );
      } catch (error) {
        console.log(error);
      }
    });
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {});
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
