const mysql = require("mysql");

const connect = mysql.createConnection({
  host: "127.0.0.1",
  user: "toor",
  password: "toor",
  database: "getlab_demo"
});

const connectToDatabase = () => {
  connect.connect(err => {
    if (err) throw err;
    console.log("Connected to database!");
  });
  return query => {
    return new Promise((accept, reject) => {
      console.log("entered query: ", query)
      connect.query(query, (error, result) => {
        try {
          if (error) reject(error)
          accept(result);
        } catch (err) {
          reject(err)
        }
      });
    })
  };
};

module.exports = connectToDatabase;
