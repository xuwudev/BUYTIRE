require("dotenv").config();

module.exports = {
  // Налаштування сервера
  server: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || "development",
  },

  // Налаштування бази даних
  database: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    name: process.env.DB_NAME || "tire_shop",
  },

  // Налаштування JWT
  jwt: {
    secret: process.env.JWT_SECRET || "my_secret_key",
    expiresIn: "7d",
  },

  // Налаштування CORS
  cors: {
    allowedOrigins:
      process.env.NODE_ENV === "production"
        ? ["https://yourdomain.com"]
        : ["http://localhost:3000"],
  },
};
