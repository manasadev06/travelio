const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    trip_type: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    short_summary: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    itinerary: {
      type: String,
      required: true,
    },
    total_budget: {
      type: Number,
      required: true,
    },
    accommodation_cost: {
      type: Number,
      required: true,
    },
    travel_cost: {
      type: Number,
      required: true,
    },
    food_misc_cost: {
      type: Number,
      required: true,
    },
    accommodation_type: {
      type: String,
      required: true,
    },
    accommodation_name: {
      type: String,
    },
    weather: {
      type: String,
      required: true,
    },
    best_time_to_visit: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    is_public: {
      type: Boolean,
      default: true,
    },
    cover_image: {
      type: String, // file path or URL
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
