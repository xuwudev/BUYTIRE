// backend/config/database.js
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Перевірка підключення
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Помилка підключення до PostgreSQL:", err.message);
    process.exit(1);
  } else {
    console.log("✅ Успішне підключення до PostgreSQL");
    release();
  }
});

module.exports = pool;
