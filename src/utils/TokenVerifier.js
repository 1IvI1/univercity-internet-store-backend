require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const accessToken = req.headers["access-token"];
  const token = accessToken ? accessToken.split(" ")[1] : null;
  // console.log(token);
  if (!token) {
    return res.status(401).json({ errorMessage: "Unathorized" });
  }
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ errorMessage: "Token expired" });
    req.user = user;
    // console.log(user);
    next();
  });
};

module.exports = verifyToken;
