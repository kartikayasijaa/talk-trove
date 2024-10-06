const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const crypto = require('crypto');
const nodemailer = require('nodemailer');

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
  // console.log(generateToken(user._id))
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
    // Generate token
    const generateOtp = () => {
      return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    };
    const resetToken = generateOtp();
    user.resetOtp = resetToken;
    user.resetOtpExpires = Date.now() + 3600000; // 1 hour expiry
    await user.save();
    
    // console.log(`resetToken: ${resetToken}`);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const otp = resetToken;
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: 'Password Reset: Talk-Trove',
      text: `Your OTP to reset the password for your Talk-Trove account.\n\n ${otp}\nIf you did not request this, please ignore this email, and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);
    res.send('OTP has been sent to your email.');

  }catch (err) {
    res.status(500);
    console.log("Error:",err);
    throw new Error("Server Error");
  }
});

const resetPass = asyncHandler(async (req, res) => {
  const { otp, password } = req.body;

  try {
    const user = await User.findOne({
      resetOtp: otp,
      resetOtpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).send('OTP is invalid or has expired.');
    }

    // Update password
    user.password = password;
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    res.send('Password has been updated.');

  } catch (err) {
    res.status(500);
    throw new Error("Server Error");
  }
});

module.exports = { allUsers, registerUser, authUser, forgotPass, resetPass };
