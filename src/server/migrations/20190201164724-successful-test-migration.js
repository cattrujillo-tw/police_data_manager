"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    console.log("successful migration up");
  },

  down: (queryInterface, Sequelize) => {
    console.log("successful migration down");
  }
};
