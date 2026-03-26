const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Перевірка підключення
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Помилка підключення до бази даних:", err.message);
    console.log("\n📝 Переконайтеся що:");
    console.log("   1. PostgreSQL запущений");
    console.log("   2. База даних 'tire_shop' існує");
    console.log("   3. Пароль правильний");
  } else {
    console.log("✅ Підключено до PostgreSQL (локальна база)");
    release();
  }
});

module.exports = pool;
