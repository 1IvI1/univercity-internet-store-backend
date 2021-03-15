const ws = require("ws");
const JsonParse = require("../utils/JsonParse");
const checkAuth = require("./utils").checkWsAuth
const url = require('url');

const onlineUsers = new Map();
const chatUsers = new Map();
const messagesUsers = new Map()
const newsUsers = new Map()

const checkSocketConnectiond = (wsUsers, pingMsg) => {
  wsUsers.forEach((x, i) => {
    if (x.readyState !== ws.OPEN) {
      // onlineUsers.delete(i);
      console.log('Deleted: ', i)
    } else if (x.readyState === ws.OPEN) {
      x.send(JSON.stringify({msg: pingMsg}))
    }
  });
}

//TODO check authorization
const HandleOnlineUsers = (request, socket, head, server) => {
  const wsServer = new ws.Server({ noServer: true });
  const chats = new ws.Server({ noServer: true });
  const messages = new ws.Server({ noServer: true });
  const news = new ws.Server({ noServer: true });

  wsServer.on("connection", wsClient => {
    wsClient.on("message", msg => {
      const parsedMsg = JsonParse(msg);
      if (parsedMsg) {
        if (parsedMsg.type === "auth") {
          checkAuth(parsedMsg.token, onlineUsers, wsClient)
        }
      }
    });

    wsClient.on("close", closedWsClient => {
      console.log("closedWsClient", closedWsClient);
    });
  });

  chats.on("connection", wsClient => {
    wsClient.on("message", msg => {
      const parsedMsg = JsonParse(msg);
      if (parsedMsg) {
        if (parsedMsg.type === "auth") {
          checkAuth(parsedMsg.token, chatUsers, wsClient)
        }
      }
    });

    wsClient.on("close", closedWsClient => {
      console.log("closedWsClient", closedWsClient);
    });
  });

  news.on("connection", wsClient => {
    wsClient.on("message", msg => {
      const parsedMsg = JsonParse(msg);
      if (parsedMsg) {
        if (parsedMsg.type === "auth") {
          checkAuth(parsedMsg.token, newsUsers, wsClient)
        }
      }
    });

    wsClient.on("close", closedWsClient => {
      console.log("closedWsClient", closedWsClient);
    });
  });

  messages.on("connection", wsClient => {
    wsClient.on("message", msg => {
      const parsedMsg = JsonParse(msg);
      if (parsedMsg) {
        if (parsedMsg.type === "auth") {
          checkAuth(parsedMsg.token, messagesUsers, wsClient)
        }
      }
    });

    wsClient.on("close", closedWsClient => {
      console.log("closedWsClient", closedWsClient);
    });
  });

  server.on('upgrade', function upgrade(request, socket, head) {
    const pathname = url.parse(request.url).pathname;

    if (pathname === '/chats') {
      chats.handleUpgrade(request, socket, head, function done(ws) {
        chats.emit('connection', ws, request);
      });
    } else if (pathname === '/messages') {
      messages.handleUpgrade(request, socket, head, function done(ws) {
        messages.emit('connection', ws, request);
      });
    } else if (pathname === '/online') {
      wsServer.handleUpgrade(request, socket, head, function done(ws) {
        wsServer.emit('connection', ws, request);
      });
    } else if (pathname === '/news') {
      news.handleUpgrade(request, socket, head, function done(ws) {
        news.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  })

  setInterval(() => {
    checkSocketConnectiond(onlineUsers, 'online')
    checkSocketConnectiond(chatUsers, 'chats')
    checkSocketConnectiond(messagesUsers, 'messages')
    checkSocketConnectiond(newsUsers, 'news')
  }, 2000 * 60000 * 5)
};

module.exports = {
  HandleOnlineUsers,
  onlineUsers,
  chatUsers,
  messagesUsers,
  newsUsers
}