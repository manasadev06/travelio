const express = require("express");
const Trip = require("../models/Trip"); // Using the new model
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

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

    const query = { is_public: true };
    if (destination) {
      query.destination = { $regex: destination, $options: "i" };
    }

    let sortOptions = {};
    if (sort === "created_at") sortOptions = { createdAt: -1 };
    else if (sort === "like_count") sortOptions = { createdAt: -1 }; // Placeholder
    else if (sort === "average_rating") sortOptions = { createdAt: -1 }; // Placeholder

    const skip = (page - 1) * limit;

    const trips = await Trip.find(query)
      .populate("user", "name avatar_url")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalItems = await Trip.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    const transformedTrips = trips.map((trip) => ({
      id: trip._id,
      title: trip.title,
      destination: trip.destination,
      cover_image_url: trip.cover_image.startsWith("http")
        ? trip.cover_image
        : `http://localhost:5000/${trip.cover_image.replace(/\\/g, "/")}`,
      user_liked: false,
      like_count: 0,
      duration: trip.duration,
      average_rating: 0,
      creator_name: trip.user?.name || "Unknown",
      creator_avatar_url: trip.user?.avatar_url || "",
      createdAt: trip.createdAt,
    }));

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

    const transformedTrip = {
      id: trip._id,
      ...trip._doc,
      cover_image_url: trip.cover_image.startsWith("http")
        ? trip.cover_image
        : `http://localhost:5000/${trip.cover_image.replace(/\\/g, "/")}`,
      creator_name: trip.user?.name || "Unknown",
      creator_avatar_url: trip.user?.avatar_url || "",
      user_liked: false,
      like_count: 0,
      average_rating: 0,
      comment_count: 0,
    };

    res.json(transformedTrip);
  } catch (error) {
    console.error("Error fetching trip details:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
