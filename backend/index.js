const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
require("dotenv").config();

// -------------------- BASIC SETUP --------------------
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// -------------------- DATABASE --------------------
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "travel_app",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
  console.log("✅ Database connected");
});

// -------------------- MIDDLEWARE --------------------
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());

// -------------------- JWT MIDDLEWARE --------------------
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
}

// -------------------- HELPER QUERY FUNCTION --------------------
function executeQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

// ====================================================
// ================= AUTH ROUTES ======================
// ====================================================

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await executeQuery(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    await executeQuery(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hash]
    );

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = await executeQuery(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ====================================================
// ================= DESTINATIONS =====================
// ====================================================

app.get("/api/destinations", async (req, res) => {
  try {
    const data = await executeQuery("SELECT * FROM destinations");
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ====================================================
// ================= REVIEWS ==========================
// ====================================================

app.post("/api/reviews", authenticateToken, async (req, res) => {
  try {
    const { destination_id, rating, comment } = req.body;

    await executeQuery(
      "INSERT INTO reviews (user_id, destination_id, rating, comment) VALUES (?, ?, ?, ?)",
      [req.user.id, destination_id, rating, comment]
    );

    res.status(201).json({ message: "Review added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ====================================================
// ================= AI FLOWCHART =====================
// ====================================================

const fetch = global.fetch || require("node-fetch");

app.post("/api/ai/plan", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: "Prompt required" });
    }

    const n8nRes = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await n8nRes.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI service failed" });
  }
});

// ====================================================
// ================= USER DASHBOARD ===================
// ====================================================

app.get("/api/user/dashboard", authenticateToken, async (req, res) => {
  try {
    const plans = await executeQuery(
      "SELECT COUNT(*) AS total FROM ai_plans WHERE user_id = ?",
      [req.user.id]
    );

    res.json({ totalPlans: plans[0].total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- 404 --------------------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// -------------------- START SERVER --------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
