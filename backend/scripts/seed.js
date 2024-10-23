const connectDB = require("../config/db");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const bcrypt = require("bcryptjs");
const User = require("../models/userModel"); // Adjust the path according to your project structure
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");

// Function to create dummy users
const createDummyUsers = async (numUsers = 10) => {
  const dummyUsers = [];

  for (let i = 1; i <= numUsers; i++) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(`password${i}`, salt);

    dummyUsers.push({
      _id:new  mongoose.Types.ObjectId(),
      name: `User_${i}`,
      email: `user${i}@example.com`,
      password: hashedPassword,
      pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    });
  }

  await User.insertMany(dummyUsers);
  console.log(`${numUsers} dummy users created!`);
  return dummyUsers;
};

// Function to create dummy groups/chats
const createDummyChats = async (users, numChats = 5) => {
  const chats = [];

  for (let i = 1; i <= numChats; i++) {
    const randomUsers = users
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * users.length) + 2); // Random users in each group

    const newChat = {
      _id:new mongoose.Types.ObjectId(),
      chatName: `GroupChat_${i}`,
      isGroupChat: true,
      users: randomUsers.map((user) => user._id),
      groupAdmin: randomUsers[0]._id,
    };

    chats.push(newChat);
  }

  await Chat.insertMany(chats);
  console.log(`${numChats} dummy group chats created!`);
  return chats;
};

// Function to create dummy messages
const createDummyMessages = async (chats, users, numMessages = 20) => {
  const messages = [];

  for (let i = 1; i <= numMessages; i++) {
    const randomChat = chats[Math.floor(Math.random() * chats.length)];
    const randomUser = users[Math.floor(Math.random() * users.length)];

    const newMessage = {
      _id:new mongoose.Types.ObjectId(),
      sender: randomUser._id,
      content: `This is a dummy message ${i}`,
      chat: randomChat._id,
    };

    messages.push(newMessage);
  }

  await Message.insertMany(messages);
  console.log(`${numMessages} dummy messages created!`);
};

// Seed the database
const seedDatabase = async () => {

  try {

    await connectDB();
    // Create dummy users
    const users = await createDummyUsers();

    // Create dummy chats
    const chats = await createDummyChats(users);

    // Create dummy messages
    await createDummyMessages(chats, users);

    console.log("Database seeded successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
