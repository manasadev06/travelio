const mongoose = require("mongoose");

const savedTripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
  },
  { timestamps: true }
);

savedTripSchema.index({ user: 1, trip: 1 }, { unique: true });

module.exports = mongoose.model("SavedTrip", savedTripSchema);
