// config.js

const Sequelize = require("sequelize");

module.exports = new Sequelize("seekex", "root", "", {
  host: "localhost",
  dialect: "mysql",
});
