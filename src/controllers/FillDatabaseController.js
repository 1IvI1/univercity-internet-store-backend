const databaseQuery = require("../index");
const returnInsertingValue = require("../utils/InsertDBValue")

const fillUsers = (body, handler) => {
  const sql = `INSERT INTO users (name,role,username,password,email,phone) VALUES (${returnInsertingValue(
    body.name
  ) +
    "," +
    returnInsertingValue("user") +
    "," +
    returnInsertingValue(body.username) +
    "," +
    returnInsertingValue(body.password) +
    "," +
    returnInsertingValue(body.email) +
    "," +
    returnInsertingValue(body.phone)})`;
    databaseQuery.runQuery(sql, handler)
};

module.exports.fillUsers = fillUsers