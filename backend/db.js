const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "travelio"
});

db.connect(err => {
  if (err) {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  } else {
    console.log("✅ MySQL connected to database:", process.env.DB_NAME || "travelio");
  }
});

// Handle connection errors
db.on('error', (err) => {
  console.error('Database connection error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Attempting to reconnect to database...');
    db.connect();
  }
});

module.exports = db;
