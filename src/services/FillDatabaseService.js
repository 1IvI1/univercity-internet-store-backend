const express = require("express");
const router = express.Router();
const FillDatabaseController = require("../controllers/FillDatabaseController");

router.post("/user", async (req, res) => {
  try {
    const body = req.body;
    FillDatabaseController.fillUsers(body, res);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
