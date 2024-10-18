const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

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

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic").execPopulate();
    message = await message.populate("chat").execPopulate();
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const editMessage = asyncHandler(async (req, res) => {
  const { messageId, newContent } = req.body;

  if (!messageId || !newContent) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  try {
    let message = await Message.findById(messageId);

    if (!message) {
      res.status(404);
      throw new Error("Message not found");
    }

    // Check if the sender of the message is the same as the requester
    if (message.sender.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("You can only edit your own messages");
    }

    // Update the content and mark the message as edited
    message.content = newContent;
    message.isEdited = true;

    await message.save();

    // Populate sender and chat details, similar to other message APIs
    message = await message.populate("sender", "name pic").execPopulate();
    message = await message.populate("chat").execPopulate();

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage, editMessage };
