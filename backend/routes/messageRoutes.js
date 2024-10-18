const express = require("express");
const {
  allMessages,
  sendMessage,
  editMessage,
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);
router.route("/edit-message").put(protect, editMessage);

module.exports = router;
