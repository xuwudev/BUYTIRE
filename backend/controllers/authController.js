const pool = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authController = {
  // Реєстрація
  async register(req, res) {
    try {
      const { email, password, full_name, phone } = req.body;

      // Перевірка чи існує користувач
      const userExists = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email],
      );

      if (userExists.rows.length > 0) {
        return res
          .status(400)
          .json({ error: "Користувач з таким email вже існує" });
      }

      // Хешування пароля
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Створення користувача
      const result = await pool.query(
        `INSERT INTO users (email, password_hash, full_name, phone, role) 
                 VALUES ($1, $2, $3, $4, $5) 
                 RETURNING id, email, full_name, phone, role`,
        [email, hashedPassword, full_name, phone, "user"],
      );

      const user = result.rows[0];

      // Створення JWT токена
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );

      res.status(201).json({
        message: "Реєстрація успішна",
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          phone: user.phone,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Помилка реєстрації:", error);
      res.status(500).json({ error: "Помилка сервера" });
    }
  },

  // Вхід
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Пошук користувача
      const result = await pool.query(
        "SELECT id, email, password_hash, full_name, phone, role FROM users WHERE email = $1",
        [email],
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: "Невірний email або пароль" });
      }

      const user = result.rows[0];

      // Перевірка пароля
      const isValidPassword = await bcrypt.compare(
        password,
        user.password_hash,
      );
      if (!isValidPassword) {
        return res.status(401).json({ error: "Невірний email або пароль" });
      }

      // Створення JWT токена
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );

      res.json({
        message: "Вхід успішний",
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          phone: user.phone,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Помилка входу:", error);
      res.status(500).json({ error: "Помилка сервера" });
    }
  },

  // Вихід
  async logout(req, res) {
    res.json({ message: "Вихід успішний" });
  },

  // Отримання поточного користувача
  async getCurrentUser(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "Не авторизовано" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const result = await pool.query(
        "SELECT id, email, full_name, phone, role FROM users WHERE id = $1",
        [decoded.id],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Користувача не знайдено" });
      }

      res.json({ user: result.rows[0] });
    } catch (error) {
      console.error("Помилка отримання користувача:", error);
      res.status(401).json({ error: "Не авторизовано" });
    }
  },
};

module.exports = authController;
