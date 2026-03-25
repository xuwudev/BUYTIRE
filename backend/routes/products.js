const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Отримати всі товари з фільтрацією
router.get("/", productController.getProducts);

// Отримати один товар
router.get("/:id", productController.getProductById);

// Отримати унікальні бренди
router.get("/filters/brands", productController.getBrands);

// Отримати популярні товари
router.get("/featured/popular", productController.getPopularProducts);

module.exports = router;
