const pool = require("../config/database");

const orderController = {
  // Створити замовлення
  async createOrder(req, res) {
    const client = await pool.connect();

    try {
      const userId = req.user.id;
      const { shipping_address, phone, comment } = req.body;

      await client.query("BEGIN");

      // Отримуємо корзину
      const cartItems = await client.query(
        `
                SELECT ci.*, p.price, p.quantity as stock, p.name_uk
                FROM cart_items ci
                JOIN products p ON ci.product_id = p.id
                WHERE ci.user_id = $1
            `,
        [userId],
      );

      if (cartItems.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({ error: "Корзина порожня" });
      }

      // Перевіряємо наявність товарів
      for (const item of cartItems.rows) {
        if (item.stock < item.quantity) {
          await client.query("ROLLBACK");
          return res.status(400).json({
            error: `Товару "${item.name_uk}" недостатньо на складі. Доступно: ${item.stock}`,
          });
        }
      }

      // Розраховуємо загальну суму
      const totalAmount = cartItems.rows.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      // Генеруємо номер замовлення
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Створюємо замовлення
      const order = await client.query(
        `INSERT INTO orders (user_id, order_number, total_amount, shipping_address, phone, comment, status, payment_status)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 RETURNING *`,
        [
          userId,
          orderNumber,
          totalAmount,
          shipping_address,
          phone,
          comment,
          "pending",
          "unpaid",
        ],
      );

      // Додаємо товари в замовлення та оновлюємо склад
      for (const item of cartItems.rows) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price_at_time)
                     VALUES ($1, $2, $3, $4)`,
          [order.rows[0].id, item.product_id, item.quantity, item.price],
        );

        // Оновлюємо кількість на складі
        await client.query(
          "UPDATE products SET quantity = quantity - $1 WHERE id = $2",
          [item.quantity, item.product_id],
        );
      }

      // Очищаємо корзину
      await client.query("DELETE FROM cart_items WHERE user_id = $1", [userId]);

      await client.query("COMMIT");

      res.status(201).json({
        message: "Замовлення успішно створено",
        order: {
          id: order.rows[0].id,
          order_number: order.rows[0].order_number,
          total_amount: order.rows[0].total_amount,
          status: order.rows[0].status,
          created_at: order.rows[0].created_at,
        },
      });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Помилка створення замовлення:", error);
      res.status(500).json({ error: "Помилка сервера" });
    } finally {
      client.release();
    }
  },

  // Отримати всі замовлення користувача
  async getUserOrders(req, res) {
    try {
      const userId = req.user.id;

      const orders = await pool.query(
        `
                SELECT o.*, 
                       COUNT(oi.id) as items_count
                FROM orders o
                LEFT JOIN order_items oi ON o.id = oi.order_id
                WHERE o.user_id = $1
                GROUP BY o.id
                ORDER BY o.created_at DESC
            `,
        [userId],
      );

      res.json(orders.rows);
    } catch (error) {
      console.error("Помилка отримання замовлень:", error);
      res.status(500).json({ error: "Помилка сервера" });
    }
  },

  // Отримати деталі замовлення
  async getOrderDetails(req, res) {
    try {
      const userId = req.user.id;
      const { orderId } = req.params;

      const order = await pool.query(
        `
                SELECT o.*
                FROM orders o
                WHERE o.id = $1 AND o.user_id = $2
            `,
        [orderId, userId],
      );

      if (order.rows.length === 0) {
        return res.status(404).json({ error: "Замовлення не знайдено" });
      }

      const items = await pool.query(
        `
                SELECT oi.*, p.name_uk, p.images
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = $1
            `,
        [orderId],
      );

      res.json({
        ...order.rows[0],
        items: items.rows,
      });
    } catch (error) {
      console.error("Помилка отримання деталей замовлення:", error);
      res.status(500).json({ error: "Помилка сервера" });
    }
  },

  // Скасувати замовлення
  async cancelOrder(req, res) {
    const client = await pool.connect();

    try {
      const userId = req.user.id;
      const { orderId } = req.params;

      await client.query("BEGIN");

      const order = await client.query(
        "SELECT * FROM orders WHERE id = $1 AND user_id = $2 AND status = $3",
        [orderId, userId, "pending"],
      );

      if (order.rows.length === 0) {
        await client.query("ROLLBACK");
        return res
          .status(400)
          .json({ error: "Неможливо скасувати замовлення" });
      }

      // Повертаємо товари на склад
      const items = await client.query(
        "SELECT * FROM order_items WHERE order_id = $1",
        [orderId],
      );

      for (const item of items.rows) {
        await client.query(
          "UPDATE products SET quantity = quantity + $1 WHERE id = $2",
          [item.quantity, item.product_id],
        );
      }

      // Оновлюємо статус замовлення
      await client.query("UPDATE orders SET status = $1 WHERE id = $2", [
        "cancelled",
        orderId,
      ]);

      await client.query("COMMIT");

      res.json({ message: "Замовлення скасовано" });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Помилка скасування замовлення:", error);
      res.status(500).json({ error: "Помилка сервера" });
    } finally {
      client.release();
    }
  },

  // Отримати статус замовлення за номером
  async getOrderStatus(req, res) {
    try {
      const { orderNumber } = req.params;

      const order = await pool.query(
        "SELECT order_number, status, total_amount, created_at FROM orders WHERE order_number = $1",
        [orderNumber],
      );

      if (order.rows.length === 0) {
        return res.status(404).json({ error: "Замовлення не знайдено" });
      }

      res.json(order.rows[0]);
    } catch (error) {
      console.error("Помилка отримання статусу:", error);
      res.status(500).json({ error: "Помилка сервера" });
    }
  },
};

module.exports = orderController;
