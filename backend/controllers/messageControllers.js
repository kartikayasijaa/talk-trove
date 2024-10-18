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

  // Extract URLs from the message content
  const urls = content.match(/https?:\/\/[^\s]+/g) || [];
  let linkPreviews = [];

  // Fetch link previews for each URL
  for (const url of urls) { 
    const preview = await fetch(`https://api.linkpreview.net/?key=efacdd90bdd79a4fcb8c942575a16531&q=${url}`) // Replace with your API key
      .then(response => response.json())
      .catch(err => console.error("Error fetching link preview:", err));
    if (preview) {
      linkPreviews.push(preview);
    }
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
    linkPreviews: linkPreviews, // Add link previews to the message
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

module.exports = { allMessages, sendMessage };
