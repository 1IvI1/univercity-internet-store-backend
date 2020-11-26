const databaseQuery = require("../index");

const login = (username, password, handler) => {
  return databaseQuery.runQuery(
    `SELECT id, name, role, email, phone FROM users WHERE username = '${username}' AND password = '${password}';`
  );
};

const getUserRefreshTokenById = (userId, handler) => {
  return databaseQuery.runQuery(
    `SELECT refreshToken FROM users WHERE id = ${userId};`
  );
};

const setUserRefreshToken = (userId, refreshToken, handler) => {
  return databaseQuery.runQuery(
    `UPDATE users SET refreshToken = '${refreshToken}' WHERE id = ${userId};`
  );
};

const deleteUserRefreshToken = (userId, handler) => {
  return databaseQuery.runQuery(
    `UPDATE users SET refreshToken = NULL WHERE id = ${userId};`
  );
};

const signUp = () => {

}

module.exports.login = login;
module.exports.getUserRefreshTokenById = getUserRefreshTokenById;
module.exports.setUserRefreshToken = setUserRefreshToken;
module.exports.deleteUserRefreshToken = deleteUserRefreshToken;
