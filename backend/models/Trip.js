const mongoose = require("mongoose");

const userSummarySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user_name: {
      type: String,
      default: "Traveler",
      trim: true,
    },
    avatar_url: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const tripDaySchema = new mongoose.Schema(
  {
    day_number: {
      type: Number,
      required: true,
      min: 1,
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    content: {
      type: String,
      default: "",
      trim: true,
    },
    image_urls: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const commentSchema = new mongoose.Schema(
  {
    ...userSummarySchema.obj,
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const reviewSchema = new mongoose.Schema(
  {
    ...userSummarySchema.obj,
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      default: "",
      trim: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const tripSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    trip_type: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    short_summary: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    itinerary: {
      type: String,
      required: true,
      trim: true,
    },
    trip_days: {
      type: [tripDaySchema],
      default: [],
    },
    total_budget: {
      type: Number,
      required: true,
      min: 0,
    },
    accommodation_cost: {
      type: Number,
      required: true,
      min: 0,
    },
    travel_cost: {
      type: Number,
      required: true,
      min: 0,
    },
    food_misc_cost: {
      type: Number,
      required: true,
      min: 0,
    },
    accommodation_type: {
      type: String,
      required: true,
      trim: true,
    },
    accommodation_name: {
      type: String,
      default: "",
      trim: true,
    },
    weather: {
      type: String,
      required: true,
      trim: true,
    },
    best_time_to_visit: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    is_public: {
      type: Boolean,
      default: true,
      index: true,
    },
    cover_image: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    creator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    likes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
    reviews: {
      type: [reviewSchema],
      default: [],
    },
    like_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    comment_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    review_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    average_rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tripSchema.pre("validate", function initialiseTrip() {
  if (!this.creator_id && this.user) {
    this.creator_id = this.user;
  }

  if (!this.short_summary && this.description) {
    this.short_summary = this.description.slice(0, 150);
  }

  if (!this.trip_days?.length && this.itinerary) {
    this.trip_days = this.itinerary
      .split(/\r?\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => ({
        day_number: index + 1,
        title: line.split(":")[0]?.trim() || `Day ${index + 1}`,
        content: line.includes(":") ? line.split(":").slice(1).join(":").trim() : line,
        image_urls: [],
      }));
  }

  this.like_count = this.likes?.length || 0;
  this.comment_count = this.comments?.length || 0;
  this.review_count = this.reviews?.length || 0;
  this.average_rating = this.review_count
    ? this.reviews.reduce((sum, review) => sum + review.rating, 0) / this.review_count
    : 0;

});

tripSchema.index({
  title: "text",
  destination: "text",
  description: "text",
  short_summary: "text",
  tags: "text",
});

module.exports = mongoose.model("Trip", tripSchema);
