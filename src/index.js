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
const ChatsRouter = require("./services/ChatsService")
const universityRuter = require("./services/UniversityService")
const postRouter = require("./services/PostsService")
const profileRouter = require("./services/ProfileService")
const subscriptionsRouter = require("./services/SubscriptionsService")

const app = express();

const server = http.createServer(app)

const databaseQuery = databaseConnector();

app.use(bodyParser.json({limit: "10mb", extended: true}));
app.use(cors());

app.use("/static", express.static(path.join(__dirname, "ws-testing", "static")))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "ws-testing", "index.html"))
})

app.use("/auth", jwt.router);
app.use("/university", universityRuter);

// app.use(verifyToken);

app.use("/chats", ChatsRouter);
app.use("/message", messagesRouter)
app.use("/database", databaseCreator.router);
app.use("/fill-database", databaseInserter);
app.use("/users", userController.router);
app.use("/post", postRouter);
app.use("/profile", profileRouter);
app.use("/subscriptions", subscriptionsRouter);

server.listen(process.env.PORT, (request, socket, head) => {
InitWsServer.HandleOnlineUsers(request, socket, head, server)

  console.log(`Listening on port: ${process.env.PORT}`);
});


module.exports.runQuery = databaseQuery;
