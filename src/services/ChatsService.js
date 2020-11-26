const express = require("express");
const router = express.Router();
const ChatsController = require("../controllers/ChatsController")

router.post("/create", async (req, res) => {
  try {
    if(!req.body.userIds) return res.status(400).json({errorMessage: "No userIds found"})
    const userIds = req.body.userIds;
    console.log('userIds', userIds)
    ChatsController.createChat(userIds)

  } catch (err) {
    console.log('Error on create chat: ', err)
  }
})



module.exports = router