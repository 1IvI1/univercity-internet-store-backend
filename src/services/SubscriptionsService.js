const express = require("express");
const { getAmISubscribed } = require("../controllers/SubscriptionsController");
const { errorLogger } = require("../utils/Logger");
const { parseJwt } = require("../websockets/utils");
const router = express.Router();

router.get("/am-i-subscribed/:id", async (req, res) => {
  console.log("zaebaaaaaaaaaaaal");
  try {
    const { id } = req.params
    const user = parseJwt(req.headers['access-token'])
    const response = await getAmISubscribed(id, user.id)
    res.json({isSub: response})
  } catch (err) {
    errorLogger(err, 400, res)
  }
})

module.exports = router