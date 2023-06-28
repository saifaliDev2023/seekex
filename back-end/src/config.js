// config.js

const Sequelize = require('sequelize');

module.exports = new Sequelize('machine_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});
