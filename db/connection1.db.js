const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const MONGODB_URL = process.env.MONGODB_URL;
    const instance = await mongoose.connect(MONGODB_URL);
    console.log(`MongoDB Connected: ${instance.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { connectDB };
