const express = require("express");
const router = express.Router();
const getAllUsers = require("../controllers/UserController").getAllUsers
const handleDatabaseQuery = require("../utils/HandleDatabaseQuery")
router.get("/get-all", async (req, res) => {
  try {
    getAllUsers(handleDatabaseQuery(res))
  } catch (err) {
    res.json({ errorMessage: err });
  }
});

module.exports.router = router;
