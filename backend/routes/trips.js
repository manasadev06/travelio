const express = require("express");
const Trip = require("../models/Trip"); // Using the new model
const SavedTrip = require("../models/SavedTrip");
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

/**
 * GET /api/trips/saved
 * Get trips saved by logged in user
 */
router.get("/saved/my-trips", auth, async (req, res) => {
  try {

    const savedTrips = await SavedTrip.find({
      user: req.user.id
    }).populate("trip");

    const trips = savedTrips.map(item => item.trip);

    res.json(trips);
    console.log("USER ID:", req.user.id);

  } catch (error) {
    console.error("Error fetching saved trips:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json(trip);
  } catch (error) {
    console.error("Error fetching trip:", error);
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
      user: req.user.id
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

    const trips = await Trip.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(trips);

  } catch (error) {

    console.error("FETCH MY TRIPS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch trips" });

  }
});

module.exports = router;
