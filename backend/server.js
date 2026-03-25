// backend/server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const pool = require("./config/database");
const config = require("./config/config");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");

const app = express();

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://yourdomain.com"
        : "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статичні файли (якщо потрібно)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Маршрути
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Простий маршрут для перевірки
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date(),
    database: pool.options.database,
  });
});

// Обробка помилок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Щось пішло не так!",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`
    🚀 Сервер запущено на порту ${PORT}
    📍 Режим: ${config.server.env}
    🗄️  База даних: ${config.db.database}
    `);
});
