const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/dashboard", auth, (req, res) => {
  const userId = req.user.id;

  const dashboardData = {};

  // Total posts
  db.query(
    "SELECT COUNT(*) AS totalPosts FROM posts WHERE user_id = ?",
    [userId],
    (err, postResult) => {
      if (err) return res.status(500).json(err);
      dashboardData.totalPosts = postResult[0].totalPosts;

      // Total likes received
      db.query(
        `SELECT COUNT(*) AS totalLikes
         FROM likes
         WHERE post_id IN (SELECT id FROM posts WHERE user_id = ?)`,
        [userId],
        (err, likeResult) => {
          if (err) return res.status(500).json(err);
          dashboardData.totalLikes = likeResult[0].totalLikes;

          // Total comments received
          db.query(
            `SELECT COUNT(*) AS totalComments
             FROM comments
             WHERE post_id IN (SELECT id FROM posts WHERE user_id = ?)`,
            [userId],
            (err, commentResult) => {
              if (err) return res.status(500).json(err);
              dashboardData.totalComments = commentResult[0].totalComments;

              // Points
              db.query(
                "SELECT points FROM users WHERE id = ?",
                [userId],
                (err, userResult) => {
                  if (err) return res.status(500).json(err);
                  dashboardData.points = userResult[0].points;

                  res.json(dashboardData);
                }
              );
            }
          );
        }
      );
    }
  );
});

module.exports = router;
