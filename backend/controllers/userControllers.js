import { sendVerificationEmail } from '../mailtrap/emails.js';
import { sendWelcomeEmail } from '../mailtrap/emails.js';
import { sendResetPasswordResetEmail } from '../mailtrap/emails.js';

const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();


// changes made Here 
generateTokenAndSetCookie(res,user._id);
        await sendVerificationEmail(user.email,verificationToken);
        res.redirect('/verify-email');

        export const verifyEmail = async (req, res) => {
          const {code} = req.body;
          try{
              const user = await User.findOne({
                  verificationToken:code,
                  verifiedTokenExpiresAt:{$gt:Date.now()}
              });
              if(!user){
                  return res.status(400).json({success:false,message:"Invalid or expired verification code"});
              }
              user.isVerified = true;
              user.verificationToken = undefined;
              user.verifiedTokenExpiresAt = undefined;
              await user.save();
      
              await sendWelcomeEmail(user.email,user.name);
              res.status(200).json({success:true,
                  message:"Email verified successfully",
                  user: {
                      ...user._doc,
                      password:undefined
                  }
              });
          }catch(error){
              console.log("error in verify email",error);
              res.status(400).json({success:false,message:error.message});
          }
      }
      


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
  console.log('hi')
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
  console.log(generateToken(user._id))

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
    throw new Error("Invalid Email or Password");
  }
});

export const forgotPassword = async (req, res) => {
  const {email} = req.body;
  try{
      const user = await User.findOne({email});
      if(!user){
          return res.status(400).json({success:false,message:"User not found"});
      }
      //Generate a random reset token
      const resetToken = crypto.randomBytes(20).toString('hex');
      const resetTokenExpiresAt = Date.now() + 60*60*1000; //1 hou r
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpiresAt = resetTokenExpiresAt;
      await user.save();
      //send email

      await sendResetPasswordResetEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`);
      res.status(200).json({success:true,message:"Password reset email link sent successfully"});
  }catch(err){
      console.log("error in forgot password",err);
      res.status(400).json({success:false,message:err.message});

  }
  }

module.exports = { allUsers, registerUser, authUser };
