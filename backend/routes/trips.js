const express = require("express");
const Trip = require("../models/Trip"); // Using the new model
const SavedTrip = require("../models/SavedTrip");
const User = require("../models/user.model");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const API_BASE_URL = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

const buildCoverImageUrl = (coverImage) => {
  if (!coverImage) return "";
  return coverImage.startsWith("http")
    ? coverImage
    : `${API_BASE_URL}/${coverImage.replace(/\\/g, "/")}`;
};

const formatTrip = (trip, viewerId = null, includeDetails = false) => {
  const plainTrip = trip.toObject ? trip.toObject() : trip;
  const creator = plainTrip.user || {};
  const viewerIdString = viewerId ? viewerId.toString() : "";
  const likes = plainTrip.likes || [];
  const reviews = plainTrip.reviews || [];
  const comments = plainTrip.comments || [];
  const reviewCount = plainTrip.review_count ?? reviews.length;
  const averageRating = reviewCount
    ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviewCount
    : 0;

  const formatted = {
    ...plainTrip,
    id: plainTrip._id?.toString(),
    creator_id: (plainTrip.creator_id || creator._id || plainTrip.user)?.toString(),
    creator_name: creator.name || "Unknown",
    creator_avatar_url: creator.avatar_url || "",
    cover_image_url: buildCoverImageUrl(plainTrip.cover_image),
    user_liked: viewerIdString
      ? likes.some((likeId) => likeId.toString() === viewerIdString)
      : false,
    like_count: plainTrip.like_count ?? likes.length,
    comment_count: plainTrip.comment_count ?? comments.length,
    review_count: reviewCount,
    average_rating: plainTrip.average_rating ?? averageRating,
    created_at: plainTrip.createdAt,
  };

  if (includeDetails) {
    formatted.comments = comments;
    formatted.reviews = reviews;
    formatted.trip_days = plainTrip.trip_days?.length
      ? plainTrip.trip_days
      : [{
          day_number: 1,
          title: "Itinerary",
          content: plainTrip.itinerary,
          image_urls: [],
        }];
  }

  return formatted;
};

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "uploads/";
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: fieldname-timestamp.ext
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});


/**
 * GET /api/trips/saved
 * Get trips saved by logged in user
 */
router.get("/saved/my-trips", auth, async (req, res) => {
  try {

    const savedTrips = await SavedTrip.find({
      user: req.user.id
    }).populate({
      path: "trip",
      populate: { path: "user", select: "name avatar_url" }
    });

    const trips = savedTrips
      .map(item => item.trip)
      .filter(Boolean)
      .map((trip) => formatTrip(trip, req.user.id));

    res.json(trips);
    console.log("USER ID:", req.user.id);

  } catch (error) {
    console.error("Error fetching saved trips:", error);
    res.status(500).json({ message: "Server error" });
  }
});



/**
 * POST /api/trips/save-ai-plan
 * Save AI generated plan
 */
router.post("/save-ai-plan", auth, async (req, res) => {
  try {

    const { prompt, plan } = req.body;

    const newTrip = new Trip({
      title: prompt || "AI Generated Trip",
      destination: "AI Planner",
      trip_type: "AI",
      duration: plan?.days?.length || 1,
      short_summary: "AI generated trip plan",
      description: plan?.text || "",
      itinerary: JSON.stringify(plan?.days || []),
      total_budget: 0,
      accommodation_cost: 0,
      travel_cost: 0,
      food_misc_cost: 0,
      accommodation_type: "Not specified",
      accommodation_name: "Not specified",
      weather: "Unknown",
      best_time_to_visit: "Anytime",
      tags: ["AI"],
      is_public: false,
      cover_image: "uploads/ai-generated-trip.jpg",
      user: req.user.id,
      creator_id: req.user.id
    });

    const savedTrip = await newTrip.save();

    res.json(savedTrip);

  } catch (error) {

    console.error("SAVE AI TRIP ERROR:", error);
    res.status(500).json({ message: error.message });

  }
});

router.get("/my-trips", auth, async (req, res) => {
  try {

    const trips = await Trip.find({
      user: req.user.id,
      trip_type: "AI"
    }).sort({ createdAt: -1 });

    res.json(trips);

  } catch (error) {

    console.error("FETCH MY TRIPS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch trips" });

  }
});

const upload = multer({ storage: storage });

/**
 * POST /api/trips
 * Create a new trip
 */
router.post("/", auth, upload.single("cover_image"), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Cover image is required" });
    }

    const {
      title,
      destination,
      trip_type,
      duration,
      short_summary,
      description,
      itinerary,
      total_budget,
      accommodation_cost,
      travel_cost,
      food_misc_cost,
      accommodation_type,
      accommodation_name,
      weather,
      best_time_to_visit,
      tags, // Expected to be JSON string
      is_public,
    } = req.body;

    // Parse tags if it's a string (JSON stringified array)
    let parsedTags = [];
    try {
      if (typeof tags === "string") {
        parsedTags = JSON.parse(tags);
      } else if (Array.isArray(tags)) {
        parsedTags = tags;
      }
    } catch (err) {
      return res.status(400).json({ message: "Invalid tags format" });
    }

    // Create new Trip
    const newTrip = new Trip({
      title,
      destination,
      trip_type,
      duration: Number(duration),
      short_summary,
      description,
      itinerary,
      total_budget: Number(total_budget),
      accommodation_cost: Number(accommodation_cost),
      travel_cost: Number(travel_cost),
      food_misc_cost: Number(food_misc_cost),
      accommodation_type,
      accommodation_name,
      weather,
      best_time_to_visit,
      tags: parsedTags,
      is_public: is_public === "true" || is_public === true,
      cover_image: req.file.path, // Save file path
      user: req.user.id,
      creator_id: req.user.id,
    });

    console.log("Saving new trip:", newTrip); // Log trip before saving

    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    console.error("Error creating trip:", error); // Log full error
    if (error.name === "ValidationError") {
        return res.status(400).json({ message: error.message, errors: error.errors });
    }
    // Remove uploaded file if save fails
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Failed to delete file after error:", err);
      });
    }
    res.status(500).json({ message: "Server error while saving trip", error: error.message });
  }
});

/**
 * GET /api/trips
 * Get all public trips with pagination and sorting
 */
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const sort = req.query.sort || "created_at";
    const destination = req.query.destination;
    const search = req.query.q;

    const query = { is_public: true };
    if (destination) {
      query.destination = { $regex: destination, $options: "i" };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { destination: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    let sortOptions = {};
    if (sort === "created_at") sortOptions = { createdAt: -1 };
    else if (sort === "like_count") sortOptions = { like_count: -1, createdAt: -1 };
    else if (sort === "average_rating") sortOptions = { average_rating: -1, review_count: -1, createdAt: -1 };

    const skip = (page - 1) * limit;

    const trips = await Trip.find(query)
      .populate("user", "name avatar_url")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalItems = await Trip.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    const transformedTrips = trips.map((trip) => formatTrip(trip, req.user?.id));

    res.json({
      trips: transformedTrips,
      pagination: {
        total_pages: totalPages,
        total_items: totalItems,
        current_page: page,
      },
    });
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/trips/:id
 * Get trip details by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate("user", "name avatar_url");
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const transformedTrip = formatTrip(trip, req.user?.id, true);

    res.json(transformedTrip);
  } catch (error) {
    console.error("Error fetching trip details:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/trips/:id/like
 * Toggle like for a trip
 */
router.post("/:id/like", auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const userId = req.user.id;
    const userIdString = userId.toString();
    const existingIndex = trip.likes.findIndex((likeId) => likeId.toString() === userIdString);
    const liked = existingIndex === -1;

    if (liked) {
      trip.likes.push(userId);
    } else {
      trip.likes.splice(existingIndex, 1);
    }

    await trip.save();

    res.json({
      liked,
      like_count: trip.like_count,
    });
  } catch (error) {
    console.error("Error liking trip:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/trips/:id/comments
 * Add a comment to a trip
 */
router.post("/:id/comments", auth, async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const user = await User.findById(req.user.id).select("name avatar_url");
    const newComment = {
      user_id: req.user.id,
      user_name: user?.name || req.user.name || "Traveler",
      avatar_url: user?.avatar_url || "",
      comment: comment.trim(),
      created_at: new Date(),
    };

    trip.comments.push(newComment);
    await trip.save();

    res.status(201).json({
      comment: trip.comments[trip.comments.length - 1],
      comment_count: trip.comment_count,
    });
  } catch (error) {
    console.error("Error commenting on trip:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/trips/:id/reviews
 * Add or update a review for a trip
 */
router.post("/:id/reviews", auth, async (req, res) => {
  try {
    const rating = Number(req.body.rating);
    const reviewText = (req.body.review || "").trim();

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const user = await User.findById(req.user.id).select("name avatar_url");
    const newReview = {
      user_id: req.user.id,
      user_name: user?.name || req.user.name || "Traveler",
      avatar_url: user?.avatar_url || "",
      rating,
      review: reviewText,
      created_at: new Date(),
    };

    const existingIndex = trip.reviews.findIndex(
      (existingReview) => existingReview.user_id.toString() === req.user.id.toString()
    );

    if (existingIndex >= 0) {
      trip.reviews[existingIndex] = newReview;
    } else {
      trip.reviews.push(newReview);
    }

    await trip.save();

    res.status(existingIndex >= 0 ? 200 : 201).json({
      review: existingIndex >= 0 ? trip.reviews[existingIndex] : trip.reviews[trip.reviews.length - 1],
      review_count: trip.review_count,
      average_rating: trip.average_rating,
    });
  } catch (error) {
    console.error("Error reviewing trip:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/trips/:id/save
 * Save a trip for a user
 */
router.post("/:id/save", auth, async (req, res) => {
  try {

    const tripId = req.params.id;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Check if already saved
    const existing = await SavedTrip.findOne({
      user: req.user.id,
      trip: tripId
    });

    if (existing) {
      return res.status(400).json({ message: "Trip already saved" });
    }

    const savedTrip = new SavedTrip({
      user: req.user.id,
      trip: tripId
    });

    await savedTrip.save();

    res.json({ message: "Trip saved successfully" });

  } catch (error) {
    console.error("Error saving trip:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
