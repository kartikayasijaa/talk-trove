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
  const { content, chatId,disappearAfter  } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request",{content, chatId});
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
    disappearAfter,
  };
  if (disappearAfter) {
    newMessage.disappearAt = new Date(Date.now() + disappearAfter * 1000);  // disappearAfter in seconds
  }
  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    console.error("Error sending message:", error); 
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };
