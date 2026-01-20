const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

// Create post (user)
router.post("/", auth, (req, res) => {
  const { title, content, rating } = req.body;

  db.query(
    "INSERT INTO posts (user_id, title, content, rating) VALUES (?, ?, ?, ?)",
    [req.user.id, title, content, rating],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Post submitted for approval" });
    }
  );
});


// Explore posts (public - approved only)
router.get("/explore", (req, res) => {
  db.query(
    "SELECT id, title, content, rating, created_at FROM posts WHERE status='approved'",
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

// Like a post
router.post("/:id/like", auth, (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  db.query(
    "INSERT INTO likes (user_id, post_id) VALUES (?, ?)",
    [userId, postId],
    err => {
      if (err)
        return res.status(400).json({ message: "Already liked" });

      // Add points to post owner
      db.query(
        "UPDATE users SET points = points + 5 WHERE id = (SELECT user_id FROM posts WHERE id = ?)",
        [postId]
      );

      res.json({ message: "Post liked, points awarded" });
    }
  );
});

// Comment on a post
router.post("/:id/comment", auth, (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const { comment } = req.body;

  db.query(
    "INSERT INTO comments (user_id, post_id, comment) VALUES (?, ?, ?)",
    [userId, postId, comment],
    err => {
      if (err) return res.status(500).json(err);

      // Add points to post owner
      db.query(
        "UPDATE users SET points = points + 10 WHERE id = (SELECT user_id FROM posts WHERE id = ?)",
        [postId]
      );

      res.json({ message: "Comment added, points awarded" });
    }
  );
});



module.exports = router;
