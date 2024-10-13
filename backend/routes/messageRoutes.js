const express = require("express");
const {
  allMessages,
  sendMessage,
  reactToMessage, // New controller for reacting to a message
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

// Route for reacting to a message
router.route("/react/:messageId").post(protect, reactToMessage);

module.exports = router;
