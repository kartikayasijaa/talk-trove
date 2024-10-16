const mongoose = require("mongoose");
const colors = require("colors");
require("dotenv").config();

const connectDB = async () => {
  try {
    console.log("MongoDB URI: ", process.env.MONGO_URL); // Check the MongoDB URI
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.green);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`.red);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
