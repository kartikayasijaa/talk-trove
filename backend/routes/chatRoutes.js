const express = require("express");
const Chat = require('../models/chatModel');
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);

// Mute a chat
router.put('/mute/:chatId', async (req, res) => {
  try {
    const chat = await Chat.findByIdAndUpdate(
      req.params.chatId,
      { isMuted: true },
      { new: true }
    );
    res.status(200).json(chat);
  } catch (error) {
    res.status(400).json({ error: 'Failed to mute the chat' });
  }
});

// Unmute a chat
router.put('/unmute/:chatId', async (req, res) => {
  try {
    const chat = await Chat.findByIdAndUpdate(
      req.params.chatId,
      { isMuted: false },
      { new: true }
    );
    res.status(200).json(chat);
  } catch (error) {
    res.status(400).json({ error: 'Failed to unmute the chat' });
  }
});

module.exports = router;
