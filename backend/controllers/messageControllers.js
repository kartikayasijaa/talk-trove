const asyncHandler = require("express-async-handler");
const { check, validationResult } = require("express-validator");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

// Get all messages for a specific chat
const allMessages = [
  check("chatId", "Invalid chat ID").isMongoId(), // Validate 'chatId' param
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "name pic email")
        .populate("chat");
      res.json(messages);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  })
];

// Send a new message
const sendMessage = [
  check("content", "Message content is required").notEmpty(), // Validate 'content'
  check("chatId", "Invalid chat ID").isMongoId(), // Validate 'chatId'
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, chatId } = req.body;

    const newMessage = {
      sender: req.user._id,
      content,
      chat: chatId,
    };

    try {
      let message = await Message.create(newMessage);

      message = await message
        .populate("sender", "name pic")
        .populate("chat")
        .execPopulate();
      message = await User.populate(message, {
        path: "chat.users",
        select: "name pic email",
      });

      // Update latestMessage in the chat
      await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

      res.json(message);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  })
];

// React to a message
const reactToMessage = [
  check("messageId", "Invalid message ID").isMongoId(), // Validate 'messageId'
  check("userId", "Invalid user ID").isMongoId(), // Validate 'userId'
  check("reaction", "Reaction is required").notEmpty(), // Validate 'reaction'
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { messageId } = req.params;
    const { userId, reaction } = req.body;

    try {
      const updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        { $push: { reactions: { user: userId, reaction: reaction } } },
        { new: true }
      ).populate("reactions.user", "name");

      if (updatedMessage) {
        res.json(updatedMessage);
      } else {
        res.status(404).json({ message: "Message not found or update failed" });
      }
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  })
];

module.exports = { allMessages, sendMessage, reactToMessage };
