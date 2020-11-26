const databaseQuery = require("../index");

const getAllUsers = handler => {
  databaseQuery.runQuery("SELECT * FROM users;", handler);
};

const getUserById = (handler, userId, ...parameters) => {
  return databaseQuery.runQuery(
    `SELECT ${parameters.reduce((acc, x, i, arr) => {
      const connector = i === arr.length - 1 ? "" : ", ";
      return (acc += `${x}${connector}`);
    }, "")} FROM users WHERE id = ${userId};`
  );
};

const checkUserExistance = ({ username, password }) => {
  return new Promise((accept) => {
    databaseQuery.runQuery(
      `SELECT id FROM users WHERE username = '${username}' AND password = '${password}';`

    ).then(result => {
      if (!result || result.length) {
        accept(true);
      } else {
        accept(false);
      }
    })
  });
};

const createNewUser = (
  { name, role, username, password, email, phone }
) => {
  const sql = `INSERT INTO users (name,role,username,password,email,phone, groups_id) VALUES 
  ('${name}','${"user"}','${username}','${password}','${email}','${phone}', 1);`;
  return databaseQuery.runQuery(sql);
};

module.exports.getAllUsers = getAllUsers;
module.exports.getUserById = getUserById;
module.exports.checkUserExistance = checkUserExistance;
module.exports.createNewUser = createNewUser;
