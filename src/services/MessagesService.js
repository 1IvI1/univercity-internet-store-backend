const express = require("express");
const router = express.Router();
const MessagesController = require("../controllers/MessagesController").MessageController

const MsgController = new MessagesController()

router.post("/send", async (req, res) => {
  try {
    const messageData = req.body
    //TODO save message in DB
    //TODO send message via ws to all online users assigned to chat or send by userId
    MsgController.broadcastMessage(messageData)
  } catch(err) {
    console.log("err", err);
  }
});

module.exports = router