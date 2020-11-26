const jwt = require("jsonwebtoken");

const generateToken = data =>
  jwt.sign(data, process.env.TOKEN_SECRET, {
    expiresIn: "100m"
  });

const generateRefreshToken = data => jwt.sign(data, process.env.REFRESH_TOKEN, {
  expiresIn: "1440m"
});

module.exports.generateToken = generateToken
module.exports.generateRefreshToken = generateRefreshToken