const databaseQuery = require("../index");

const createDatabase = (handler, name) => {
  databaseQuery.runQuery(`CREATE DATABASE ${name};`, handler);
};

const createUserstable = handler => {
  databaseQuery.runQuery(
    `CREATE TABLE users (
         id int AUTO_INCREMENT PRIMARY KEY,
         name varchar(25),
         role varchar(10),
         username varchar(25),
         password varchar(25),
         email varchar(30),
         phone varchar(15),
         refreshToken text
       );`,
    handler
  );
};

const addNewTableRow = (tableName, row, handler) => {
  databaseQuery.runQuery(`ALTER TABLE ${tableName}
  ADD ${row};`, handler)
}

module.exports.createDatabase = createDatabase;
module.exports.createUserstable = createUserstable
module.exports.addNewTableRow = addNewTableRow