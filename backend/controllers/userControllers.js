const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const PasswordReset = require("../models/ResetOTPModel");
const generateToken = require("../config/generateToken");
const generateOtp = require("../config/generateOtp");
const { sendEmail } = require("../config/emailService");

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if(!user){
    res.status(401);
    throw new Error("Invalid Email");
  }
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Password");
  }
});

const forgotPass = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("User with this email does not exist");
    }
    const resetToken = generateOtp();
    const passwordReset = new PasswordReset({
      userId: user._id,
      otp: resetToken,
      otpExpires: Date.now() + 3600000, // 1 hour expiry
    });
    await passwordReset.save();
    
    const subject = 'Password Reset: Talk-Trove';
    const text = `Your OTP to reset the password for your Talk-Trove account.\n\n ${resetToken}\nIf you did not request this, please ignore this email, and your password will remain unchanged.\n`;

    await sendEmail({ to: user.email, subject, text });
    res.send('OTP has been sent to your email.');

  }catch (err) {
    res.status(500);
    throw new Error("Server Error");
  }
});

const resetPass = asyncHandler(async (req, res) => {
  const { otp, password } = req.body;

  try {
    const passwordReset = await PasswordReset.findOne({
      otp: otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!passwordReset) {
      return res.status(400).send('OTP is invalid or has expired.');
    }
    // Update password
    const user = await User.findById(passwordReset.userId);
    user.password = password;
    await PasswordReset.findOneAndDelete({ userId: user._id });
    await user.save();

    res.send('Password has been updated.');

  } catch (err) {
    res.status(500);
    console.log(err);
    throw new Error("Server Error");
  }
});

module.exports = { allUsers, registerUser, authUser, forgotPass, resetPass };
