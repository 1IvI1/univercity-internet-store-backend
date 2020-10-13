const jwt = require("jsonwebtoken");

const generateToken = data =>
  jwt.sign(data, process.env.TOKEN_SECRET, {
    expiresIn: "10m"
  });

const generateRefreshToken = data => jwt.sign(data, process.env.REFRESH_TOKEN);

module.exports.generateToken = generateToken
module.exports.generateRefreshToken = generateRefreshToken