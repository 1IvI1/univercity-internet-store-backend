const express = require("express");
const router = express.Router();
const { getAllUsers, getFilteredUsers, subscribeToUser, deleteSubscription, addAvatar, getUserAvatar } = require("../controllers/UserController");
const { errorLogger } = require("../utils/Logger");
const { parseJwt } = require("../websockets/utils");

router.get("/get-all", async (req, res) => {
  try {
    const jwtParsed = parseJwt(req.headers['access-token'])
    if (!jwtParsed) {
      res.json({ errorMessage: "Error in jwt" });
    }
    const users = await getAllUsers(jwtParsed.id)
    res.send(users)
  } catch (err) {
    res.status(400).json({ errorMessage: err.toString() });
  }
});

router.get("/get-filtered/:university/:faculty/:group/:name", async (req, res) => {
  try {
    const params = req.params
    const jwtParsed = parseJwt(req.headers['access-token'])
    const response = await getFilteredUsers({ ...params, id: jwtParsed.id })
    res.send(response)
  } catch (err) {
    res.sendStatus(400)
  }
})

router.post("/subscribe/:id", async (req, res) => {
  try {
    const subscriptionId = req.params.id
    const jwtParsed = parseJwt(req.headers['access-token'])
    await subscribeToUser({ subscriberId: jwtParsed.id, subscribtionId: subscriptionId })
    res.sendStatus(200)
  } catch (err) {
    res.status(400).json({ errorMessage: err.toString() })
  }
})

router.delete("/unsubscribe/:id", async (req, res) => {
  try {
    const { id } = req.params
    const jwtParsed = parseJwt(req.headers['access-token'])
    await deleteSubscription({ id: jwtParsed.id, subscriptionId: id })
    res.sendStatus(200)
  } catch (err) {
    res.status(400).json({ errorMessage: err })
  }
})

router.post("/avatar", async (req, res) => {
  try {
    const user = parseJwt(req.headers['access-token'])
    const image64 = req.body.image
    await addAvatar(image64, user.id)
    res.sendStatus(200)
  } catch (err) {
    errorLogger(err, 400, res)
  }
})

router.get("/avatar/:id", async (req, res) => {
  try {
    const { id } = req.params
    const response = await getUserAvatar(id)
    res.send(response)
  } catch (err) {
    errorLogger(err, 400, res)
  }
})

module.exports.router = router;
