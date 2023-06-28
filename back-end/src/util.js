const sequelize = require("./config");

async function dbSync() {
  sequelize
    .sync()
    .then(() => {
      console.log("Tables created in the database");
      // Start your server or perform any other operations
    })
    .catch((error) => {
      console.error("Error synchronizing models:", error);
    });
}

module.exports = dbSync;
