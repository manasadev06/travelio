import mongoose from "mongoose";

const savedTripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: String,
  description: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("SavedTrip", savedTripSchema);