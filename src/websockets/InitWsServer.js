const ws = require("ws");
const JsonParse = require("../utils/JsonParse");
const checkAuth = require("./utils").checkWsAuth

const onlineUsers = new Map();

//TODO check authorization
const HandleOnlineUsers = server => {
  const wsServer = new ws.Server({ server });

  wsServer.on("connection", wsClient => {
    wsClient.on("message", msg => {
      const parsedMsg = JsonParse(msg);
      if (parsedMsg) {
        if(parsedMsg.type === "auth") {
          checkAuth(parsedMsg.token, onlineUsers, wsClient)
        }
      }
    });

    wsClient.on("close", closedWsClient => {
      console.log("closedWsClient", closedWsClient);
    });
  });

  setInterval(() => {
    onlineUsers.forEach((x, i) => {
      if (x.readyState !== ws.OPEN) {
        onlineUsers.delete(i);
        console.log('Closed: ', i)
      } else if(x.readyState === ws.OPEN) {
        // x.send(JSON.stringify({msg: "hello"}))
      }
    });
  }, 2000/*60000 * 5*/);
};

module.exports.HandleOnlineUsers = HandleOnlineUsers;
module.exports.onlineUsers = onlineUsers;
