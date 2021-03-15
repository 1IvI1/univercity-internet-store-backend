const express = require("express");
const router = express.Router();
const jwtParser = require("jwt-decode")
const { sendMessage, broadcastMessage, getLastMessages, getChatMessages, setMessageIsRead } = require("../controllers/MessagesController")

router.post("/send", async (req, res) => {
  try {
    console.log('req.body', req.body)
    const { message, chatId } = req.body.data
    if (!message || !chatId) return res.status(400).json({
      errorMessage: (() => {
        if (!message && chatId) return "There is no message"
        else if (!chatId && message) return "Wrong chatId"
        else if (!chatId && !message) return "Wrong message and no chatId"
      })()
    })

    const parsedToken = jwtParser(req.headers["access-token"].split(" ")[1])
    console.log('parsedToken', parsedToken)
    sendMessage({ msg: message, chatId, authorId: parsedToken.id, authorName: parsedToken.name }).then(() => {
      broadcastMessage({ msg: message, chatId, authorId: parsedToken.id, authorName: parsedToken.name }).then(response => {
        console.log('Mesage broadcasted with response', response)
        res.send(response)
      })
    })
  } catch (err) {
    console.log("err", err);
  }
});

router.get("/last-message/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId
    const lastMessagesData = await getLastMessages(userId)
    res.send(lastMessagesData)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.get("/chat-messages/:chatId", async (req, res) => {
  try {
    const chatId = req.params.chatId
    const chatMessages = await getChatMessages(chatId)
    res.send(chatMessages)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.put("/is-read/:msgId", async (req, res) => {
  try {
    const msgId =  req.params.msgId
    const response = await setMessageIsRead(msgId)
    res.send(response)
  } catch (err) {
    res.status(400).send(err)
  }
})

module.exports = router