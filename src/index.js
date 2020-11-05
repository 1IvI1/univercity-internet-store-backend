require("dotenv").config();
const express = require("express");
const http = require("http")
const databaseConnector = require("./database/DatabaseConnector");
const jwt = require("./services/JwtTokenService");
const databaseCreator = require("./services/CreateDatabaseService");
const databaseInserter = require("./services/FillDatabaseService");
const userController = require("./services/UserService");
const verifyToken = require("./utils/TokenVerifier")
const bodyParser = require("body-parser");
const cors = require("cors");
const InitWsServer = require("./websockets/InitWsServer")
const path = require("path")
const messagesRouter = require("./services/MessagesService")

const app = express();

const server = http.createServer(app)

const databaseQuery = databaseConnector();

app.use(bodyParser.json());
app.use(cors());

app.use("/static", express.static(path.join(__dirname, "ws-testing", "static")))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "ws-testing", "index.html"))
})

app.use("/auth", jwt.router);

app.use(verifyToken);

app.use("/database", databaseCreator.router);
app.use("/fill-database", databaseInserter);
app.use("/users", userController.router);
app.use("/message", messagesRouter)


server.listen(process.env.PORT, () => {
  console.log(`Listening on port: ${process.env.PORT}`);
});

InitWsServer.HandleOnlineUsers(server)

module.exports.runQuery = databaseQuery;
