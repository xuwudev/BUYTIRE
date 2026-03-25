const pool = require("../config/database");

const cartController = {
  // Отримати корзину
  async getCart(req, res) {
    try {
      const userId = req.user.id;

      const result = await pool.query(
        `
                SELECT ci.*, p.name_uk, p.price, p.images, p.quantity as stock
                FROM cart_items ci
                JOIN products p ON ci.product_id = p.id
                WHERE ci.user_id = $1
            `,
        [userId],
      );

      const cartItems = result.rows.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        product: {
          id: item.product_id,
          name_uk: item.name_uk,
          price: item.price,
          images: item.images,
          stock: item.stock,
        },
      }));

      const total = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      );

      res.json({
        items: cartItems,
        total: total,
        items_count: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      });
    } catch (error) {
      console.error("Помилка отримання корзини:", error);
      res.status(500).json({ error: "Помилка сервера" });
    }
  },

  // Додати товар в корзину
  async addToCart(req, res) {
    try {
      const userId = req.user.id;
      const { productId, quantity = 1 } = req.body;

      // Перевірка чи існує товар
      const product = await pool.query(
        "SELECT id, quantity FROM products WHERE id = $1 AND is_active = true",
        [productId],
      );

      if (product.rows.length === 0) {
        return res.status(404).json({ error: "Товар не знайдено" });
      }

      if (product.rows[0].quantity < quantity) {
        return res.status(400).json({ error: "Недостатньо товару на складі" });
      }

      // Перевірка чи товар вже в корзині
      const existingItem = await pool.query(
        "SELECT id, quantity FROM cart_items WHERE user_id = $1 AND product_id = $2",
        [userId, productId],
      );

      if (existingItem.rows.length > 0) {
        // Оновлюємо кількість
        const newQuantity = existingItem.rows[0].quantity + quantity;
        await pool.query("UPDATE cart_items SET quantity = $1 WHERE id = $2", [
          newQuantity,
          existingItem.rows[0].id,
        ]);
      } else {
        // Додаємо новий товар
        await pool.query(
          "INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)",
          [userId, productId, quantity],
        );
      }

      res.json({ message: "Товар додано до корзини" });
    } catch (error) {
      console.error("Помилка додавання в корзину:", error);
      res.status(500).json({ error: "Помилка сервера" });
    }
  },

  // Оновити кількість товару
  async updateCartItem(req, res) {
    try {
      const userId = req.user.id;
      const { productId } = req.params;
      const { quantity } = req.body;

      if (quantity <= 0) {
        return cartController.removeFromCart(req, res);
      }

      const result = await pool.query(
        "UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *",
        [quantity, userId, productId],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Товар не знайдено в корзині" });
      }

      res.json({ message: "Кількість оновлено" });
    } catch (error) {
      console.error("Помилка оновлення корзини:", error);
      res.status(500).json({ error: "Помилка сервера" });
    }
  },

  // Видалити товар з корзини
  async removeFromCart(req, res) {
    try {
      const userId = req.user.id;
      const { productId } = req.params;

      await pool.query(
        "DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2",
        [userId, productId],
      );

      res.json({ message: "Товар видалено з корзини" });
    } catch (error) {
      console.error("Помилка видалення з корзини:", error);
      res.status(500).json({ error: "Помилка сервера" });
    }
  },

  // Очистити корзину
  async clearCart(req, res) {
    try {
      const userId = req.user.id;

      await pool.query("DELETE FROM cart_items WHERE user_id = $1", [userId]);

      res.json({ message: "Корзину очищено" });
    } catch (error) {
      console.error("Помилка очищення корзини:", error);
      res.status(500).json({ error: "Помилка сервера" });
    }
  },
};

module.exports = cartController;
