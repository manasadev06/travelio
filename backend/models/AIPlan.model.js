const mongoose = require("mongoose");

const aiPlanSchema = new mongoose.Schema(
  {
    user_id: mongoose.Schema.Types.ObjectId,
    prompt: String,
    response: Object
  },
  { timestamps: true }
);

module.exports = mongoose.model("AIPlan", aiPlanSchema);
