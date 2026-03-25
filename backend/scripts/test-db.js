// backend/scripts/test-db.js
const pool = require("../config/database");
require("dotenv").config();

async function testConnection() {
  console.log("🔍 Тестуємо підключення до бази даних...");
  console.log("📊 Конфігурація:", {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
  });

  try {
    const result = await pool.query(
      "SELECT NOW() as current_time, version() as postgres_version",
    );
    console.log("✅ Підключення успішне!");
    console.log("🕒 Поточний час в БД:", result.rows[0].current_time);
    console.log("📦 Версія PostgreSQL:", result.rows[0].postgres_version);

    // Перевіряємо чи існують таблиці
    const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);

    console.log(
      "📋 Таблиці в базі даних:",
      tables.rows.map((t) => t.table_name).join(", ") || "немає таблиць",
    );
  } catch (error) {
    console.error("❌ Помилка підключення:", error.message);
    console.error("📝 Деталі:", error);
  } finally {
    await pool.end();
  }
}

testConnection();
