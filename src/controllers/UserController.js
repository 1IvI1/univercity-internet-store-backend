const databaseQuery = require("../index");

const getAllUsers = handler => {
  databaseQuery.runQuery("SELECT * FROM users;", handler);
};

module.exports.getAllUsers = getAllUsers;
