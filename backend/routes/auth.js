const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Реєстрація
router.post("/register", authController.register);

// Вхід
router.post("/login", authController.login);

// Вихід
router.post("/logout", authController.logout);

// Отримання поточного користувача
router.get("/me", authController.getCurrentUser);

module.exports = router;
