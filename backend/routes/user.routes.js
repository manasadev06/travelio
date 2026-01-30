const express = require("express");
const User = require("../models/user.model");
const Trip = require("../models/Trip");
const auth = require("../middleware/auth");

const router = express.Router();

// GET /api/user/dashboard - User dashboard statistics
router.get("/dashboard", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const userIdObj = typeof userId === 'string' ? userId : userId.toString();

    // Get user's trips count (using trips as "posts" equivalent)
    const totalPosts = await Trip.countDocuments({ creator_id: userId });

    // Get total likes received on user's trips
    const userTrips = await Trip.find({ creator_id: userId }).select('_id').lean();
    const tripIds = userTrips.map(t => t._id);
    const tripsWithLikes = await Trip.find({ _id: { $in: tripIds } }).select('like_count').lean();
    const totalLikes = tripsWithLikes.reduce((sum, trip) => sum + (trip.like_count || 0), 0);

    // Get total comments received on user's trips
    const tripsWithComments = await Trip.find({ _id: { $in: tripIds } }).select('comment_count').lean();
    const totalComments = tripsWithComments.reduce((sum, trip) => sum + (trip.comment_count || 0), 0);

    // Get user for points (if points field exists, otherwise default to 0)
    const user = await User.findById(userId).select('points').lean();
    const points = user?.points || 0;

    res.json({
      totalPosts,
      totalLikes,
      totalComments,
      points
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/user/profile - Get current user's profile (authenticated)
router.get("/profile", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const userIdObj = typeof userId === 'string' ? userId : userId.toString();

    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's trips
    const trips = await Trip.find({ creator_id: userId })
      .sort({ created_at: -1 })
      .lean();

    // Calculate stats from trips
    const trip_count = trips.length;
    const total_likes_received = trips.reduce((sum, trip) => sum + (trip.like_count || 0), 0);
    const allRatings = trips.flatMap(trip => (trip.reviews || []).map(r => r.rating));
    const average_rating_received = allRatings.length > 0
      ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length
      : 0;

    // Format trips for response (convert _id to id)
    const formattedTrips = trips.map(trip => ({
      ...trip,
      id: trip._id.toString()
    }));

    res.status(200).json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      bio: user.bio || null,
      avatar_url: user.avatar_url || null,
      role: user.role,
      created_at: user.createdAt || user.created_at,
      trip_count,
      total_likes_received,
      average_rating_received: parseFloat(average_rating_received.toFixed(2)),
      trips: formattedTrips
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/user/profile - Update current user's profile (authenticated)
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, bio, avatar_url } = req.body;
    const userId = req.user.id;
    const userIdObj = typeof userId === 'string' ? userId : userId.toString();

    // Validate input
    if (name && name.trim().length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters long' });
    }

    if (bio && bio.length > 500) {
      return res.status(400).json({ message: 'Bio must be less than 500 characters' });
    }

    // Update user profile
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (bio !== undefined) updateData.bio = bio ? bio.trim() : null;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;

    await User.findByIdAndUpdate(userId, updateData, { new: true });

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/users/:id - Get public user profile by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's trips
    const trips = await Trip.find({ creator_id: id })
      .sort({ created_at: -1 })
      .lean();

    // Calculate stats from trips
    const trip_count = trips.length;
    const total_likes_received = trips.reduce((sum, trip) => sum + (trip.like_count || 0), 0);
    const allRatings = trips.flatMap(trip => (trip.reviews || []).map(r => r.rating));
    const average_rating_received = allRatings.length > 0
      ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length
      : 0;

    // Format trips for response (convert _id to id)
    const formattedTrips = trips.map(trip => ({
      ...trip,
      id: trip._id.toString()
    }));

    res.status(200).json({
      id: user._id.toString(),
      name: user.name,
      bio: user.bio || null,
      avatar_url: user.avatar_url || null,
      role: user.role,
      created_at: user.createdAt || user.created_at,
      trip_count,
      total_likes_received,
      average_rating_received: parseFloat(average_rating_received.toFixed(2)),
      trips: formattedTrips
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
