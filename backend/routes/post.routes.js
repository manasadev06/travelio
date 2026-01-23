const express = require("express");
const Post = require("../models/Post.model");
const User = require("../models/user.model");
const auth = require("../middleware/auth");

const router = express.Router();

// Create post (user)
router.post("/", auth, async (req, res) => {
  try {
    const { title, content, rating } = req.body;
    const userId = req.user.id;

    const post = new Post({
      user_id: userId,
      title,
      content,
      rating: rating || 0,
      status: "pending"
    });

    await post.save();

    res.json({ message: "Post submitted for approval" });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Explore posts (public - approved only)
router.get("/explore", async (req, res) => {
  try {
    const posts = await Post.find({ status: "approved" })
      .select("_id title content rating createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const formattedPosts = posts.map(post => ({
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      rating: post.rating,
      created_at: post.createdAt
    }));

    res.json(formattedPosts);
  } catch (error) {
    console.error("Explore posts error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Like a post
router.post("/:id/like", auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const userIdStr = typeof userId === 'string' ? userId : userId.toString();

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if already liked
    const isLiked = post.likes.some(likeId => likeId.toString() === userIdStr);

    if (isLiked) {
      return res.status(400).json({ message: "Already liked" });
    }

    // Add like
    post.likes.push(userId);
    await post.save();

    // Add points to post owner (if points field exists)
    const postOwner = await User.findById(post.user_id);
    if (postOwner) {
      postOwner.points = (postOwner.points || 0) + 5;
      await postOwner.save();
    }

    res.json({ message: "Post liked, points awarded" });
  } catch (error) {
    console.error("Like post error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Comment on a post
router.post("/:id/comment", auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Add comment
    post.comments.push({
      user_id: userId,
      comment: comment.trim(),
      created_at: new Date()
    });

    await post.save();

    // Add points to post owner (if points field exists)
    const postOwner = await User.findById(post.user_id);
    if (postOwner) {
      postOwner.points = (postOwner.points || 0) + 10;
      await postOwner.save();
    }

    res.json({ message: "Comment added, points awarded" });
  } catch (error) {
    console.error("Comment post error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
