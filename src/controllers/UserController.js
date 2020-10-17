const databaseQuery = require("../index");

const getAllUsers = handler => {
  databaseQuery.runQuery("SELECT * FROM users;", handler);
};

const getUserById = (handler, userId, ...parameters) => {
  databaseQuery.runQuery(
    `SELECT ${parameters.reduce((acc, x, i, arr) => {
      const connector = i === arr.length - 1 ? "" : ", ";
      return (acc += `${x}${connector}`);
    }, "")} FROM users WHERE id = ${userId};`,
    handler
  );
};

const checkUserExistance = (handler, { username, password }) => {
  databaseQuery.runQuery(
    `SELECT id FROM users WHERE username = '${username}' AND password = '${password}';`,
    result => {
      if (!result || result.length) {
        handler(true);
      } else {
        handler(false);
      }
    }
  );
};

const createNewUser = (
  handler,
  { name, role, username, password, email, phone }
) => {
  console.log("from request", { name, role, username, password, email, phone });
  const sql = `INSERT INTO users (name,role,username,password,email,phone) VALUES 
  ('${name}','${"user"}','${username}','${password}','${email}','${phone}');`;
  databaseQuery.runQuery(sql, handler);
};

module.exports.getAllUsers = getAllUsers;
module.exports.getUserById = getUserById;
module.exports.checkUserExistance = checkUserExistance;
module.exports.createNewUser = createNewUser;
