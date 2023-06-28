// Required libraries
const express = require("express");
const app = express();
const cors = require("cors");

const routes = require("./src/routes");
// const sequelize = require("./src/config");
const dbSync = require("./src/util");

// ** Check DB is connected or not
dbSync();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/api", routes);

app.listen(3030, () => console.log(`Server works on port no: 3030`));
