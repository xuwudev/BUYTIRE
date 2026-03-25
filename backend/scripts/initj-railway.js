const pool = require("../config/database");
const fs = require("fs");
const path = require("path");

async function initRailwayDB() {
  try {
    console.log("🔄 Ініціалізація бази даних на Railway...");

    const sqlPath = path.join(__dirname, "../../database/init.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    await pool.query(sql);
    console.log("✅ Таблиці створено");

    // Додати тестові дані
    const seedPath = path.join(__dirname, "seed-db.js");
    if (fs.existsSync(seedPath)) {
      require("./seed-db");
    }
  } catch (error) {
    console.error("❌ Помилка:", error.message);
  } finally {
    await pool.end();
  }
}

initRailwayDB();
