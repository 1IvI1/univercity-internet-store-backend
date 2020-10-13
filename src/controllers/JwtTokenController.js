const databaseQuery = require("../index");

const login = (username, password, handler) => {
  databaseQuery.runQuery(
    `SELECT id, name, role, email, phone FROM users WHERE username = '${username}' AND password = '${password}';`,
    handler
  );
};

const getUserRefreshTokenById = (userId, handler) => {
  databaseQuery.runQuery(
    `SELECT refreshToken FROM users WHERE id = ${userId};`,
    handler
  );
};

const setUserRefreshToken = (userId, refreshToken, handler) => {
  databaseQuery.runQuery(
    `UPDATE users SET refreshToken = '${refreshToken}' WHERE id = ${userId};`,
    handler
  );
};

const deleteUserRefreshToken = (userId, handler) => {
  databaseQuery.runQuery(
    `UPDATE users SET refreshToken = NULL WHERE id = ${userId};`,
    handler
  );
};

module.exports.login = login;
module.exports.getUserRefreshTokenById = getUserRefreshTokenById;
module.exports.setUserRefreshToken = setUserRefreshToken;
module.exports.deleteUserRefreshToken = deleteUserRefreshToken;
