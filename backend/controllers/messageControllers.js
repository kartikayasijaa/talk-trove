const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

// Get all messages for a specific chat
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Send a new message
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  // Validate the request data
  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  const newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    // Populate the message with sender and chat information
    message = await message
      .populate("sender", "name pic")
      .populate("chat")
      .execPopulate();
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const reactToMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { userId, reaction } = req.body;

  // Implement the logic for reacting to the message
  // Example: Find the message and update the reactions
  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      {
        $push: { reactions: { user: userId, reaction: reaction } },
      },
      { new: true }
    ).populate("reactions.user", "name");

    res.json(updatedMessage);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage, reactToMessage }; // Make sure reactToMessage is included here

