const onlineUsers = require("../websockets/InitWsServer").onlineUsers;

function MessageController() {

  this.broadcastMessage = msgData => {
    if(msgData.hasOwnProperty("chatId")) {
      this.broadcastMsgViaChatId(msgData)
    } else {
      this.broadcastMsgViaUserId(msgData)
    }
  };

  this.broadcastMsgViaUserId = messageData => {
    onlineUsers.forEach((x, i) => {
      if (messageData.id === i) {
        x.send(messageData.message);
      }
    });
  };

  this.broadcastMsgViaChatId = messageData => {
    console.log('messageData', messageData)
  }
}

module.exports.MessageController = MessageController;
