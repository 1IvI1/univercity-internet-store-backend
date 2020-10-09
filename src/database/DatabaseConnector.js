const mysql = require("mysql");

const connect = mysql.createConnection({
  host: "127.0.0.1",
  user: "toor",
  password: "toor"
});

const connectToDatabase = () => {
  connect.connect(err => {
    if (err) throw err; 
    console.log("Connected!");
  });
  connect.on('error', function(err) {
    console.log("[mysql error]",err);
  });
};

module.exports = connectToDatabase