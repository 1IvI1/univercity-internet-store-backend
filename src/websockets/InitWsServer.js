const ws = require("ws");
const JsonParse = require("../utils/JsonParse");

const onlineUsers = new Map();

//TODO check authorization
const HandleOnlineUsers = server => {
  const wsServer = new ws.Server({ server });

  wsServer.on("connection", wsClient => {
    wsClient.on("message", msg => {
      const parsedMsg = JsonParse(msg);
      if (parsedMsg) {
        console.log("parsedMsg", parsedMsg);
        onlineUsers.set(parsedMsg.id, wsClient);
        wsClient.send(`Hi ${parsedMsg.name}`);
      } else {
        console.log("Closing ws");
        wsClient.close();
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
      }
    });
  }, 60000 * 5);
};

module.exports.HandleOnlineUsers = HandleOnlineUsers;
module.exports.onlineUsers = onlineUsers;
