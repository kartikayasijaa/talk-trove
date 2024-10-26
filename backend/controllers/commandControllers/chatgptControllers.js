const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const { OpenAI } = require('openai');
const Message = require("../../models/messageModel");
const Chat = require("../../models/chatModel");
const User = require("../../models/userModel");

dotenv.config()

const openai = new OpenAI({
  key: process.env.OPENAI_API_KEY
});
const chatgpt = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  const model = "gpt-3.5-turbo";
  if (!content || !chatId) {
    return res.status(400).send({ message: "Invalid data passed into request" });
  }
  try {
    // getting response from the model
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: "You are a helpful assistant" },
        { role: "user", content: content },
      ],
      temperature: 0.7,
      max_tokens: 256,
    });
    const chatgptMessage = response.choices[0].message.content; //extracting response output
    console.log(chatgptMessage);    
    // generating message object for the response
    const newMessage = {
      sender: req.user._id, 
      content: chatgptMessage,
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
    throw new Error("Error generating ChatGPT response.");
  }
});

module.exports = chatgpt ;