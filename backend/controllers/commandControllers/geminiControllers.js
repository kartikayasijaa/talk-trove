const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const Message = require("../../models/messageModel");
const Chat = require("../../models/chatModel");
const User = require("../../models/userModel");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config()

console.log(process.env.GEMINI_API_KEY)

const geminiAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({model:"gemini-1.5-flash"});
const gemini = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    return res.status(400).send({ message: "Invalid data passed into request" });
  }
  try {
    // getting response from the model
    const systemPrompt = "You are a helpful assistant. Generate only simple text output based on the user's prompt.";
    const response = await geminiAI.generateContent(`${systemPrompt}\nUser: ${content}`);
    
    const geminiMessage = response.response.text(); // extracting the response output
    console.log(geminiMessage)

    // generating a message object for the response 
    const newMessage = {
      sender: req.user._id,
      content: geminiMessage,
      chat: chatId,
    };
    let message = await Message.create(newMessage);

    // populating the response as a message in the chats
    message = await message.populate("sender", "name pic").execPopulate();
    message = await message.populate("chat").execPopulate();
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
    res.json(message);
  } catch (error) {
    res.status(500);
    console.error(error);
    throw new Error("Error generating Gemini response.");
  }
});

module.exports = gemini ;