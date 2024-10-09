const mongoose = require("mongoose");

const passwordResetSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  otp: {
    type: String,
    required: true,
    default: ""
  },
  otpExpires: {
    type: Date,
    required: true,
  },
});

const PasswordReset = mongoose.model("PasswordReset", passwordResetSchema);

module.exports = PasswordReset;