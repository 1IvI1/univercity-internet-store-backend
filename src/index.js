require("dotenv").config();
const express = require("express");
const databaseConnector = require("./database/DatabaseConnector");
const jwt = require("./services/JwtTokenService");
const databaseCreator = require("./services/CreateDatabaseService");
const databaseInserter = require("./services/FillDatabaseService");
const userController = require("./services/UserService");
const verifyToken = require("./utils/TokenVerifier")
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const databaseQuery = databaseConnector();

app.use(bodyParser.json());
app.use(cors());

app.use("/auth", jwt.router);

app.use(verifyToken);

app.use("/database", databaseCreator.router);
app.use("/fill-database", databaseInserter);
app.use("/users", userController.router);



app.listen(process.env.PORT, () => {
  console.log(`Listening on port: ${process.env.PORT}`);
});

module.exports.runQuery = databaseQuery;
