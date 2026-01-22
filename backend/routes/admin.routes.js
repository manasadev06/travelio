const express = require("express");
const Post = require("../models/Post.model");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/posts/pending", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    const posts = await Post.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .lean();

    const formattedPosts = posts.map(post => ({
      ...post,
      id: post._id.toString()
    }));

    res.json(formattedPosts);
  } catch (error) {
    console.error("Get pending posts error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/posts/:id/approve", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    const postId = req.params.id;

    const post = await Post.findByIdAndUpdate(
      postId,
      { status: "approved" },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post approved" });
  } catch (error) {
    console.error("Approve post error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
