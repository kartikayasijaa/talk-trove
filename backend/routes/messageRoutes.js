const express = require("express");
const {
  allMessages,
  sendMessage,
  reactToMessage, // Controller for reacting to a message
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Routes for messages
router.route("/:chatId").get(protect, allMessages); // Get all messages for a chat
router.route("/").post(protect, sendMessage); // Send a new message
router.route("/react/:messageId").post(protect, reactToMessage); // React to a specific message

module.exports = router;
