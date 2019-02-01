"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    console.log("task successfully migrated up")
  },

  down: (queryInterface, Sequelize) => {
    console.log("task successfully migrated down")
  }
};
