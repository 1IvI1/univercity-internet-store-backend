const express = require("express");
const router = express.Router();
const ChatsController = require("../controllers/ChatsController")
const { sendMessage } = require("../controllers/MessagesController")

router.post("/create", async (req, res) => {
  try {
    const { userIds, name } = req.body;
    console.log('userIds', userIds, name, req.body)
    if (!userIds || !name) return res.status(400).json({ errorMessage: "No userIds found" })
    const response = await ChatsController.createChat({ userIds, name })
    await sendMessage({msg: "Hello!", chatId: response, authorId: userIds[0], authorName: name.split(" -")[0]})
    res.json({ chatId: response })
  } catch (err) {
    console.log('Error on create chat: ', err)
  }
})



module.exports = router