const express = require("express");
const {
  allMessages,
  sendMessage,
  likeToggle,
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);
router.route("/:messageId/like-toggle").patch(protect, likeToggle);

module.exports = router;
