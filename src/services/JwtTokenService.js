require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JwtController = require("../controllers/JwtTokenController");
const JwtTokenGenerators = require("../utils/JwtTokenGenerators");
const userController = require("../controllers/UserController");

router.get("/check-login", async (req, res) => {
  try {
    const accessToken = req.headers["access-token"];
    const userToken = accessToken ? accessToken.split(" ")[1] : null;
    console.log(userToken);
    if (!userToken)
      return res.status(400).json({ errorMessage: "Got no token" });
    jwt.verify(userToken, process.env.REFRESH_TOKEN, error => {
      if (error)
        return res
          .status(403)
          .json({ errorMessage: "Invalid token, may be corrupted" });
      res.status(200).json("Token is valid");
    });
  } catch {
    res.status(400).json({ errorMessage: "Got no token" });
  }
});

router.get("/check", async (req, res) => {
  try {
    const accessToken = req.headers["access-token"];
    const refreshToken = req.headers["refresh-token"];
    const userToken = accessToken ? accessToken.split(" ")[1] : null;
    const userRefreshToken = refreshToken ? refreshToken.split(" ")[1] : null;
    if (!userToken || !userRefreshToken)
      return res.status(400).json({ errorMessage: "Got no token" });
    jwt.verify(userToken, process.env.TOKEN_SECRET, error => {
      if (error) {
        return res
          .status(403)
          .json({ errorMessage: "Invalid token, may be corrupted" });
      }
      jwt.verify(userRefreshToken, process.env.REFRESH_TOKEN, error => {
        if (error) {
          return res.status(401).json({
            errorMessage: "Refresh token is not valid"
          })
        }
        res.status(200).json("Tokens are valid");
      })
    });
  } catch {
    res.status(400).json({ errorMessage: "Got no token" });
  }
});

router.put("/logout", async (req, res) => {
  try {
    const userId = req.body.data.id;
    console.log('userId', userId)
    if (!userId) return res.status(400).json({ errorMessage: "Got no userId" });
    JwtController.deleteUserRefreshToken(userId).then(result => {
      console.log("Successfully logged out for user: ", userId, result);
      res.sendStatus(200);
    });
  } catch (err) {
    res.sendStatus(400)
  }
});

router.post("/refresh-token", async (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken)
    return res.status(400).json({ errorMessage: "Got no refresh token" });
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (error, user) => {
    JwtController.getUserRefreshTokenById(user.id).then(userRefreshToken => {
      const readyUserRefreshToken = userRefreshToken.length
        ? userRefreshToken[0].refreshToken
        : null;
      // if (readyUserRefreshToken !== refreshToken){
      //   console.log("readyUserRefreshToken !== refreshToken",readyUserRefreshToken !== refreshToken)
      //   return res.status(400).json({ errorMessage: "Invalid refresh token" });}
      if (error)
        return res
          .status(403)
          .json({ errorMessage: "Invalid refresh token, may be corrupted" });
      delete user.exp;
      delete user.iat;
      const accessToken = JwtTokenGenerators.generateToken(user);
      const newRefreshToken = JwtTokenGenerators.generateRefreshToken(user);
      JwtController.setUserRefreshToken(user.id, newRefreshToken).then(result => {
        console.log("Set refresh token for user: ", user.id, result);
      });
      res.json({ accessToken, newRefreshToken });
    })
  });
});

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  JwtController.login(username, password).then(response => {
    const user = response && response.length ? { ...response[0] } : null;
    if (!user)
      return res
        .status(400)
        .json({ errorMessage: "Invalid login or password" });
    const accessToken = JwtTokenGenerators.generateToken(user);
    const refreshToken = JwtTokenGenerators.generateRefreshToken(user);
    JwtController.setUserRefreshToken(user.id, refreshToken).then(result => {
      console.log("Set refresh token for user: ", user.id);
    });
    res.json({ accessToken, refreshToken });
  });
});

router.post("/sign-up", async (req, res) => {
  try {
    const { name, role, username, password, email, phone } = req.body;
    console.log(req.body);
    userController.checkUserExistance(

      { username, password }
    ).then(result => {
      if (result)
        return res.status(400).json({ errorMessage: "User already exists" });
      userController.createNewUser(
        { name, role, username, password, email, phone }
      ).then(() => {
        res.json("Succesfully registered")
      })
    })
  } catch (err) {
    console.log("Error on /sign-up route: ", err);
  }
});

module.exports.router = router;
