const { Pool } = require("pg");
require("dotenv").config();

// Railway надає DATABASE_URL автоматично
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DB_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
  // або якщо використовуєте окремі змінні:
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // host: process.env.DB_HOST,
  // port: process.env.DB_PORT,
  // database: process.env.DB_NAME,
});

pool.on("connect", () => {
  console.log("✅ Підключено до PostgreSQL");
});

pool.on("error", (err) => {
  console.error("❌ Помилка PostgreSQL:", err);
});

module.exports = pool;
