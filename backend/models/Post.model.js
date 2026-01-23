const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  comments: [{
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    comment: String,
    created_at: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
