const express = require("express");
const router = express.Router();
const jwtParser = require("jwt-decode")
const { sendMessage, broadcastMessage, getLastMessages } = require("../controllers/MessagesController")

router.post("/send", async (req, res) => {
  try {
    console.log('req.body', req.body)
    const { msg, chatId } = req.body
    if (!msg || !chatId) return res.status(400).json({
      errorMessage: (() => {
        if (!msg && chatId) return "There is no message"
        else if (!chatId && msg) return "Wrong chatId"
        else if (!chatId && !msg) return "Wrong message and no chatId"
      })()
    })

    const parsedToken = jwtParser(req.headers["access-token"].split(" ")[1])
    console.log('parsedToken', parsedToken)
    sendMessage({ msg, chatId, authorId: parsedToken.id }).then(() => {
      broadcastMessage({ msg, chatId, authorId: parsedToken.id }).then(response => {
        console.log('Mesage broadcasted with response', response)
      })
    })
  } catch (err) {
    console.log("err", err);
  }
});

router.get("/last-message/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId
    const getLastMessagesData = await getLastMessages(userId)
    res.send(getLastMessagesData)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.get("/chat-messages", async (req, res) => {
  try {
    const { chatId } = req.body
  } catch (err) {

  }
})

module.exports = router