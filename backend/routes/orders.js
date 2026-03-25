const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/auth");

// Публічний маршрут для перевірки статусу замовлення
router.get("/status/:orderNumber", orderController.getOrderStatus);

// Захищені маршрути
router.use(authMiddleware);

// Створити замовлення
router.post("/", orderController.createOrder);

// Отримати всі замовлення користувача
router.get("/my-orders", orderController.getUserOrders);

// Отримати деталі замовлення
router.get("/:orderId", orderController.getOrderDetails);

// Скасувати замовлення
router.put("/:orderId/cancel", orderController.cancelOrder);

module.exports = router;
