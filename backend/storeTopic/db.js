const mysql = require("mysql");
const util = require("util"); // <-- import util

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "students",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to the database in db.");
});

// ✅ Promisify query for async/await
db.query = util.promisify(db.query);

module.exports = db;
