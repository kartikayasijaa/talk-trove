const connectDB = require("../config/db");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel"); 
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");

console.log("MongoDB URI: ", process.env.MONGO_URL);

// Function to create dummy users
const createDummyUsers = async (numUsers = 10) => {
  const dummyUsers = [];

  for (let i = 1; i <= numUsers; i++) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(`password${i}`, salt);

    dummyUsers.push({
      _id: mongoose.Types.ObjectId(),
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
      .slice(0, Math.floor(Math.random() * users.length) + 2);

    const newChat = {
      _id: mongoose.Types.ObjectId(),
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
      _id: mongoose.Types.ObjectId(),
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

    await User.deleteMany({});
    await Chat.deleteMany({});
    await Message.deleteMany({});

    const users = await createDummyUsers();
    const chats = await createDummyChats(users);
    await createDummyMessages(chats, users);

    console.log("Database seeded successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

console.log("MongoDB URI: ", process.env.MONGO_URL);

seedDatabase();

