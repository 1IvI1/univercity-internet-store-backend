require("dotenv").config();
const jwt = require("jsonwebtoken")

const checkWsAuth = (token, onlineUsers, wsClient) => {
  
  jwt.verify(token, process.env.TOKEN_SECRET, (error, decodedJwt) => {
    if (error) {
      console.log('error', error)
      wsClient.close()
    } else {
      onlineUsers.set(decodedJwt.id, wsClient);
      wsClient.send(`Hi ${decodedJwt.id}`);
    }
  });
}

module.exports.checkWsAuth = checkWsAuth