const pool = require("../config/database");

const productController = {
  // Отримати всі товари з фільтрацією
  async getProducts(req, res) {
    try {
      const { category, brand, diameter, season, minPrice, maxPrice, search } =
        req.query;
      let query = `
                SELECT p.*, c.name_uk as category_name 
                FROM products p
                JOIN categories c ON p.category_id = c.id
                WHERE p.is_active = true
            `;
      const params = [];
      let paramIndex = 1;

      if (category) {
        query += ` AND c.type = $${paramIndex}`;
        params.push(category);
        paramIndex++;
      }

      if (brand) {
        query += ` AND p.brand = $${paramIndex}`;
        params.push(brand);
        paramIndex++;
      }

      if (diameter) {
        query += ` AND p.diameter = $${paramIndex}`;
        params.push(parseInt(diameter));
        paramIndex++;
      }

      if (season) {
        query += ` AND p.season = $${paramIndex}`;
        params.push(season);
        paramIndex++;
      }

      if (minPrice) {
        query += ` AND p.price >= $${paramIndex}`;
        params.push(parseFloat(minPrice));
        paramIndex++;
      }

      if (maxPrice) {
        query += ` AND p.price <= $${paramIndex}`;
        params.push(parseFloat(maxPrice));
        paramIndex++;
      }

      if (search) {
        query += ` AND (p.name_uk ILIKE $${paramIndex} OR p.brand ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      query += " ORDER BY p.created_at DESC";

      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      console.error("Помилка отримання товарів:", error);
      res.status(500).json({ error: "Помилка сервера" });
    }
  },

  // Отримати один товар
  async getProductById(req, res) {
    try {
      const result = await pool.query(
        `
                SELECT p.*, c.name_uk as category_name
                FROM products p
                JOIN categories c ON p.category_id = c.id
                WHERE p.id = $1
            `,
        [req.params.id],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Товар не знайдено" });
      }

      // Отримати відгуки
      const reviews = await pool.query(
        `
                SELECT r.*, u.full_name
                FROM reviews r
                LEFT JOIN users u ON r.user_id = u.id
                WHERE r.product_id = $1
                ORDER BY r.created_at DESC
            `,
        [req.params.id],
      );

      const product = result.rows[0];
      product.reviews = reviews.rows;

      res.json(product);
    } catch (error) {
      console.error("Помилка отримання товару:", error);
      res.status(500).json({ error: "Помилка сервера" });
    }
  },

  // Отримати унікальні бренди
  async getBrands(req, res) {
    try {
      const result = await pool.query(`
                SELECT DISTINCT brand 
                FROM products 
                WHERE brand IS NOT NULL AND is_active = true
                ORDER BY brand
            `);
      res.json(result.rows.map((r) => r.brand));
    } catch (error) {
      console.error("Помилка отримання брендів:", error);
      res.status(500).json({ error: "Помилка сервера" });
    }
  },

  // Отримати популярні товари
  async getPopularProducts(req, res) {
    try {
      const result = await pool.query(`
                SELECT p.*, c.name_uk as category_name
                FROM products p
                JOIN categories c ON p.category_id = c.id
                WHERE p.is_active = true
                ORDER BY p.created_at DESC
                LIMIT 8
            `);
      res.json(result.rows);
    } catch (error) {
      console.error("Помилка отримання популярних товарів:", error);
      res.status(500).json({ error: "Помилка сервера" });
    }
  },
};

module.exports = productController;
