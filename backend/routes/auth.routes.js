const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Missing fields" });

  const hashed = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashed],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User registered" });
    }
  );
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err || result.length === 0)
        return res.status(401).json({ message: "Invalid credentials" });

      const user = result[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match)
        return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        "SECRET_KEY",
        { expiresIn: "1d" }
      );

      res.json({ token });
    }
  );
});

module.exports = router;
