const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is required. Add it to backend/.env or your deployment environment.");
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log(`MongoDB connected: ${mongoose.connection.name}`);
};

module.exports = connectDB;
