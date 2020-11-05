const mysql = require("mysql");

const connect = mysql.createConnection({
  host: "192.168.0.3",
  user: "toor",
  password: "toor",
  database: "getlab_demo"
});

const connectToDatabase = () => {
  connect.connect(err => {
    if (err) throw err;
    console.log("Connected to database!");
  });
  return (query, handler) => {
    console.log("entered query: ", query)
    connect.query(query, (error, result) => {
      try {
        if(error) throw error
        handler(result);
      } catch (err) {
        console.log("err: ", err);
      }
    });
  };
};

module.exports = connectToDatabase;
