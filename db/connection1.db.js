const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const MONGODB_URL = process.env.MONGODB_URL;

    if (!MONGODB_URL) {
      console.error(" MONGODB_URL is not defined in environment variables");
      process.exit(1);
    }

    const instance = await mongoose.connect(MONGODB_URL);
    console.log(` MongoDB Connected: ${instance.connection.host}`);
  } catch (error) {
    console.error(" MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
