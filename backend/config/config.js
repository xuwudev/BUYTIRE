require("dotenv").config();

module.exports = {
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME,
    url: process.env.DATABASE_URL,
  },
  server: {
    port: parseInt(process.env.PORT) || 5000,
    env: process.env.NODE_ENV || "development",
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: "7d",
  },
};
