const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/auth");

// Всі маршрути корзини вимагають автентифікацію
router.use(authMiddleware);

// Отримати корзину
router.get("/", cartController.getCart);

// Додати товар в корзину
router.post("/add", cartController.addToCart);

// Оновити кількість товару
router.put("/update/:productId", cartController.updateCartItem);

// Видалити товар з корзини
router.delete("/remove/:productId", cartController.removeFromCart);

// Очистити корзину
router.delete("/clear", cartController.clearCart);

module.exports = router;
