"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    console.log("migrate up succeeded");
  },

  down: (queryInterface, Sequelize) => {
    console.log("migrate down succeeded");
  }
};
