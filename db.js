const { Pool } = require("pg");
require("dotenv").config();

console.log(">>> USING DB.JS FROM:", __filename);

console.log("Connecting to PostgreSQL with:");
console.log("HOST:", process.env.DB_HOST);
console.log("PORT:", process.env.DB_PORT);
console.log("USER:", process.env.DB_USER);
console.log("DB:", process.env.DB_NAME);




const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASS || ""), 
  port: process.env.DB_PORT || 5432,
});


pool.query("SELECT version();")
  .then(res => console.log("DB VERSION:", res.rows[0].version))
  .catch(err => console.error("VERSION ERROR:", err));

module.exports = pool;


