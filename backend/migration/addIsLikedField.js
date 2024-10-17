const Message = require("../../backend/models/messageModel");

Message.updateMany(
  { isLiked: { $exists: false } },
  { $set: { isLiked: false } }
)
  .then(() => console.log("Added isLiked field to existing documents"))
  .catch((err) => console.error("Error updating documents:", err));
