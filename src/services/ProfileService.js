const express = require("express");
const { errorLogger } = require("../utils/Logger");
const router = express.Router();
const {getUsersProfileData} = require("../controllers/ProfileController")

router.get("/data/:id", async (req, res) => {
  try {
    const id = req.params.id
    const response = await getUsersProfileData(id)
    res.send(response)
  } catch(error) {
    errorLogger(error, 400, res)
  }
})

module.exports = router