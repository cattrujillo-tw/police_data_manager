const db = require("../src/server/policeDataManager/models");

(async function () {
  const env = process.argv.slice(2)[0] || "development";
  console.log("Creating Schema in DB Env:", env);

  const config = require(__dirname +
    "/../src/server/config/sequelize_config.js")[env];

  db.sequelize
    .sync({ force: true })
    .then(() => {
      console.log("*************************");
      console.log("Schema import successful");
      process.exit(0);
    })
    .catch(err => {
      console.log("*************************");
      console.log("Schema import failed. Error:", err.message);
      console.log("Schema import failed. Full Error:", err);
      process.exit(1);
    });
})();
