"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    throw Error(
      "this error should not be thrown because the migration up will already have run successfully"
    );
  },

  down: (queryInterface, Sequelize) => {
    throw Error(
      "this error should not be thrown because the migration down will already have run successfully"
    );
  }
};
