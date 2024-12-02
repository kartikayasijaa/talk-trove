const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.get("/", (req, res) => {
  res.send("API is running..");
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: [
      "http://localhost:3000",
      "https://chat-app-two-theta-52.vercel.app",
      "https://chatapi.gitleet.live",
    ],
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("reactMessage", async ({ messageId, userId, reaction }) => {
    try {
      // Fetch the message from the database
      const message = await Message.findById(messageId); // Assuming Message is your Mongoose model
  
      if (!message) {
        return console.error("Message not found");
      }
  
      // Check if the user has already reacted
      const existingReactionIndex = message.reactions.findIndex(
        (r) => r.user.toString() === userId
      );
  
      if (existingReactionIndex !== -1) {
        // Update the existing reaction
        message.reactions[existingReactionIndex].reaction = reaction;
      } else {
        // Push a new reaction
        message.reactions.push({ user: userId, reaction });
      }
  
      // Save the updated message
      const updatedMessage = await message.save();
  
      // Broadcast the updated message with reactions to all clients
      socket.broadcast.emit("messageReaction", updatedMessage);
    } catch (error) {
      console.error("Error in reacting to message:", error);
    }
  });
  