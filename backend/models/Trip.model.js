const mongoose = require("mongoose");

const tripDaySchema = new mongoose.Schema(
  {
    day_number: Number,
    title: String,
    content: String,
    image_urls: [String]
  },
  { _id: false }
);

const commentSchema = new mongoose.Schema(
  {
    user_id: mongoose.Schema.Types.ObjectId,
    user_name: String,
    avatar_url: String,
    comment: String,
    created_at: { type: Date, default: Date.now }
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    user_id: mongoose.Schema.Types.ObjectId,
    user_name: String,
    avatar_url: String,
    rating: Number,
    review: String,
    created_at: { type: Date, default: Date.now }
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema({
  title: String,
  destination: String,
  duration: Number,
  description: String,

  cover_image_url: String,

  creator_id: mongoose.Schema.Types.ObjectId,
  creator_name: String,
  creator_avatar_url: String,

  trip_days: [tripDaySchema],
  likes: [mongoose.Schema.Types.ObjectId],

  comments: [commentSchema],
  reviews: [reviewSchema],

  like_count: { type: Number, default: 0 },
  comment_count: { type: Number, default: 0 },
  review_count: { type: Number, default: 0 },
  average_rating: { type: Number, default: 0 },

  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Trip", tripSchema);
