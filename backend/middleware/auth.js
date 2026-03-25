const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: "Доступ заборонено. Токен не надано" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Помилка верифікації токена:", error);
    return res.status(401).json({ error: "Невірний або прострочений токен" });
  }
};

module.exports = authMiddleware;
