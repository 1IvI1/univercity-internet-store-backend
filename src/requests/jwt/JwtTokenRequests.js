require("dotenv").config()
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const checkUserExistance = (usename, password) => {
  //TODO request database, check if exists user
  return {
    username: usename,
    id: "1"
  }
}

router.post("/", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  //TODO check if user exists in database
  const existingUser = checkUserExistance(username, password)

  if(!existingUser) {
    return res.status(401).json({errorMessage: "Usename or password is incorrect"})
  }

  const accessToken = jwt.sign(existingUser, process.env.TOKEN_SECRET)
  
  res.json({accessToken})
});

module.exports = router;
