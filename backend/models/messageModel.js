const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    reactions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reaction: { 
          type: String, 
          enum: ['👍', '❤️', '😂', '😢', '🎉'], // Updated to match emojis used
          required: true 
        },
      },
    ],
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
