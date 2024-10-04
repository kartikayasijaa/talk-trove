const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  const MONGO_URL =
    process.env.MONGO_URL || `mongodb://127.0.0.1:27017/talk-trove`;
  try {
    const conn = await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    });

    console.log(`MongoDB Connected`);
  } catch (error) {
    throw error;
  }
};

module.exports = connectDB;
