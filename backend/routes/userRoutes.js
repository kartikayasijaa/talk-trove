const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Route to get all users (protected)
router.route("/").get(protect, allUsers).post(registerUser);

// Route to log in a user
router.post("/login", authUser);

// Route to get the profile of the logged-in user
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router;
