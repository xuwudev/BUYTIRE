const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/database");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const compression = require("compression");

const app = express();

// Простий CORS для локальної розробки
app.use(cors());
app.use(express.json());
app.use(
  compression({
    level: 6, // рівень стиснення (1-9)
    threshold: 1024, // стискати відповіді більші за 1KB
  }),
);

// Маршрути
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Перевірка здоров'я
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "OK",
      timestamp: new Date(),
      database: "PostgreSQL (локальна)",
      db_time: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({ status: "ERROR", error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
    🚀 Сервер запущено на порту ${PORT}
    📍 Режим: ${process.env.NODE_ENV || "development"}
    🗄️  База даних: локальна PostgreSQL
    🔗 http://localhost:${PORT}/api/health
  `);
});
