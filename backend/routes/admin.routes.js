const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/posts/pending", auth, (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admins only" });

  db.query(
    "SELECT * FROM posts WHERE status='pending'",
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

router.put("/posts/:id/approve", auth, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }

  const postId = req.params.id;

  db.query(
    "UPDATE posts SET status='approved' WHERE id=?",
    [postId],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Post approved" });
    }
  );
});



module.exports = router;
