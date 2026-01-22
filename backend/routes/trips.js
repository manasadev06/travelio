const express = require("express");
const Trip = require("../models/Trip.model");
const User = require("../models/user.model");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * POST /api/trips
 * Upload a trip with day-wise itinerary
 */
router.post("/", auth, async (req, res) => {
  try {
    const {
      title,
      destination,
      duration,
      description,
      cover_image_url,
      trip_days,
    } = req.body;

    // ---- BASIC VALIDATION ----
    if (
      !title ||
      !destination ||
      !duration ||
      !description ||
      !Array.isArray(trip_days) ||
      trip_days.length === 0
    ) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // Get creator info
    const creator = await User.findById(req.user.id);
    if (!creator) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create trip with embedded trip_days
    const trip = new Trip({
      title,
      destination,
      duration,
      description,
      cover_image_url: cover_image_url || null,
      creator_id: req.user.id,
      creator_name: creator.name,
      creator_avatar_url: creator.avatar_url || null,
      trip_days: trip_days.map(day => ({
        day_number: day.day_number,
        title: day.title,
        content: day.content,
        image_urls: day.image_urls || []
      })),
      likes: [],
      comments: [],
      reviews: [],
      like_count: 0,
      comment_count: 0,
      review_count: 0,
      average_rating: 0
    });

    await trip.save();

    res.status(201).json({
      message: "Trip uploaded successfully",
      trip_id: trip._id.toString(),
    });
  } catch (err) {
    console.error("UPLOAD TRIP ERROR:", err);
    res.status(500).json({ message: "Failed to upload trip" });
  }
});

/**
 * GET /api/trips
 * Get all trips with pagination, sorting, and filtering
 */
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 12, destination, sort = "created_at" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const userId = req.user ? req.user.id : null;

    // Build query
    const query = {};
    if (destination) {
      query.destination = { $regex: destination, $options: "i" };
    }

    // Build sort object
    const validSorts = ["created_at", "average_rating", "like_count", "comment_count"];
    const sortField = validSorts.includes(sort) ? sort : "created_at";
    const sortObj = { [sortField]: -1 };

    // Get trips
    const trips = await Trip.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Add user_liked field
    const tripsWithLiked = trips.map(trip => {
      const tripObj = { ...trip };
      tripObj.id = trip._id.toString();
      const userIdStr = userId ? (typeof userId === 'string' ? userId : userId.toString()) : null;
      tripObj.user_liked = userIdStr ? trip.likes.some(likeId => likeId.toString() === userIdStr) : false;
      tripObj.day_count = trip.trip_days ? trip.trip_days.length : 0;
      return tripObj;
    });

    // Get total count
    const total = await Trip.countDocuments(query);

    res.status(200).json({
      trips: tripsWithLiked,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / parseInt(limit)),
        total_items: total,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Get trips error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * GET /api/trips/:id
 * Get trip details
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;

    const trip = await Trip.findById(id).lean();

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Format response
    const userIdStr = userId ? (typeof userId === 'string' ? userId : userId.toString()) : null;
    const tripObj = {
      ...trip,
      id: trip._id.toString(),
      user_liked: userIdStr ? trip.likes.some(likeId => likeId.toString() === userIdStr) : false,
      day_count: trip.trip_days ? trip.trip_days.length : 0
    };

    // Format comments and reviews (they're already embedded)
    tripObj.comments = trip.comments || [];
    tripObj.reviews = trip.reviews || [];
    tripObj.trip_days = trip.trip_days || [];

    res.status(200).json(tripObj);
  } catch (error) {
    console.error("Get trip details error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * PUT /api/trips/:id
 * Update trip (creator only)
 */
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, destination, duration, description, cover_image_url } = req.body;
    const creatorId = req.user.id;

    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const creatorIdStr = typeof creatorId === 'string' ? creatorId : creatorId.toString();
    if (trip.creator_id.toString() !== creatorIdStr) {
      return res.status(403).json({ message: "You can only edit your own trips" });
    }

    // Update fields
    if (title) trip.title = title;
    if (destination) trip.destination = destination;
    if (duration) trip.duration = duration;
    if (description) trip.description = description;
    if (cover_image_url !== undefined) trip.cover_image_url = cover_image_url;

    await trip.save();

    res.status(200).json({ message: "Trip updated successfully" });
  } catch (error) {
    console.error("Update trip error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * DELETE /api/trips/:id
 * Delete trip (creator only)
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const creatorId = req.user.id;

    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const creatorIdStr = typeof creatorId === 'string' ? creatorId : creatorId.toString();
    if (trip.creator_id.toString() !== creatorIdStr) {
      return res.status(403).json({ message: "You can only delete your own trips" });
    }

    await Trip.findByIdAndDelete(id);

    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Delete trip error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * POST /api/trips/:id/like
 * Like/unlike trip
 */
router.post("/:id/like", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const userIdObj = typeof userId === 'string' ? userId : userId.toString();
    const likesArray = trip.likes.map(likeId => likeId.toString());
    const isLiked = likesArray.includes(userIdObj);

    if (isLiked) {
      // Unlike - remove user from likes array
      trip.likes = trip.likes.filter(likeId => likeId.toString() !== userIdObj);
      trip.like_count = Math.max(0, trip.like_count - 1);
      await trip.save();
      res.status(200).json({ message: "Trip unliked", liked: false });
    } else {
      // Like - add user to likes array (Mongoose will convert string to ObjectId)
      trip.likes.push(userId);
      trip.like_count = trip.like_count + 1;
      await trip.save();
      res.status(200).json({ message: "Trip liked", liked: true });
    }
  } catch (error) {
    console.error("Like trip error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * POST /api/trips/:id/comments
 * Add comment to trip
 */
router.post("/:id/comments", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;

    if (!comment || comment.trim().length < 1) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    if (comment.trim().length > 500) {
      return res.status(400).json({ message: "Comment must be less than 500 characters" });
    }

    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Get user info
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add comment to embedded array
    const newComment = {
      user_id: userId,
      user_name: user.name,
      avatar_url: user.avatar_url || null,
      comment: comment.trim(),
      created_at: new Date()
    };

    trip.comments.push(newComment);
    trip.comment_count = trip.comment_count + 1;
    await trip.save();

    res.status(201).json({
      message: "Comment added successfully",
      comment: newComment
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * POST /api/trips/:id/reviews
 * Add review to trip
 */
router.post("/:id/reviews", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;
    const userId = req.user.id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Check if user already reviewed
    const userIdStr = typeof userId === 'string' ? userId : userId.toString();
    const existingReview = trip.reviews.find(r => r.user_id.toString() === userIdStr);
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this trip" });
    }

    // Get user info
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add review to embedded array
    const newReview = {
      user_id: userId,
      user_name: user.name,
      avatar_url: user.avatar_url || null,
      rating: parseInt(rating),
      review: review ? review.trim() : null,
      created_at: new Date()
    };

    trip.reviews.push(newReview);
    trip.review_count = trip.review_count + 1;

    // Calculate average rating
    const totalRating = trip.reviews.reduce((sum, r) => sum + r.rating, 0);
    trip.average_rating = totalRating / trip.review_count;

    await trip.save();

    res.status(201).json({
      message: "Review added successfully",
      review: newReview
    });
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
