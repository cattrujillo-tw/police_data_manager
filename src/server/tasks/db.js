var Sequelize = require("sequelize");
var env = process.env.NODE_ENV || "development";
// TODO Do we need this?
// if (env === 'test') {
//     env += process.env.JEST_WORKER_ID;
// }
var config = require("./task_config")[env];
var db = {};

var sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
