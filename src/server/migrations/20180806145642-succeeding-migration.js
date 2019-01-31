"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    console.log("succeeded");
  },

  down: (queryInterface, Sequelize) => {
    console.log("succeeded down");
  }
};
