import User from "../models/User";
import bcrypt from "bcryptjs";
import status from "http-status";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import crypto from "crypto";
import axios from "axios";

dotenv.config();

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) res.status(401).json({ message: "User already exists" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    console.log("user ", user);
    res.status(status.CREATED).json({ message: user });
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ message: error });
  }
};

const initiateVerifyUser = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user)
      res.status(status.BAD_REQUEST).json({ message: "User not found" });
    console.log("usere ", user.email);
    const verificationUrl = `http://localhost:5000/api/auth/verify-email?token=${user.verificationToken}`;
    await axios.post("https://api.web3forms.com/submit", {
      access_key: process.env.access_key,
      name: user.name,
      email: user.email,
      message: verificationUrl,
    });
    // const transporter = nodemailer.createTransport({
    //   service: "Gmail",
    //   auth: {
    //     user: process.env.NODE_EMAILER_USERNAME,
    //     pass: process.env.NODE_EMAILER_PASSWORD,
    //   },
    // });
    // const emailOptions = {
    //   from: process.env.NODE_EMAILER_USERNAME,
    //   to: user.email,
    //   subject: "Email Verification",
    //   text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
    // };
    // transporter.sendMail(emailOptions, (error, info) => {
    //   if (error) {
    //     res.status(status.INTERNAL_SERVER_ERROR).json({ message: error });
    //   } else {
    //     res.status(status.OK).json({ message: "Verification email is sent" });
    //   }
    // });
    res.status(status.OK).json({ message: "please check your email" });
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ message: error });
  }
};

const verifyUser = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ verificationToken: token });
    console.info(user);
    if (!user) {
      res.status(status.UNAUTHORIZED).json({ message: "Unauthorised access" });
    } else {
      user.isVerified = true;
      await user.save();
      res.status(status.OK).json({ message: "Email verified" });
    }
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ message: error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      res.status(status.UNAUTHORIZED).json({ message: "Unauthorised" });
    if (!user.isVerified) {
      return res.status(400).json({ message: "Email not verified" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(status.UNAUTHORIZED).json({ message: "Invalid credentials" });
    } else {
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "3h",
          algorithm: "HS256",
        }
      );
      res.status(status.OK).json({ message: "LoggedIn successfylly", token });
    }
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).json({
      message: error,
    });
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      res.status(status.BAD_REQUEST).json({ message: "User not found" });
    user.resetPasswordToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    // send reset email
    const resetUrl = `http://localhost:5000/api/auth/reset-password?token=${user.resetPasswordToken}`;
    await axios.post("https://api.web3forms.com/submit", {
      access_key: process.env.access_key,
      name: user.name,
      email: user.email,
      message: resetUrl,
    });
    // const nodemailer = nodemailer.createTransport({
    //   service: "Gmail",
    //   auth: {
    //     user: process.env.NODE_EMAILER_USERNAME,
    //     pass: process.env.NODE_EMAILER_PASSWORD,
    //   },
    // });
    // const mailOptions = {
    //   from: "your-email@gmail.com",
    //   to: user.email,
    //   subject: "Password Reset",
    //   text: `Please reset your password by clicking on the following link: ${resetUrl}`,
    // };
    // nodemailer.sendMail(mailOptions, (error, info) => {
    //   if (error)
    //     res
    //       .status(status.INTERNAL_SERVER_ERROR)
    //       .json({ message: "Unable to send mail due to ", error });
    //   res.status(status.OK).json({ message: "Sent reset email" });
    // });
    res.status(status.OK).json({ message: "please check your email" });
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ message: error });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(status.BAD_REQUEST)
        .json({ message: "Invalid or expired token" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      res.status(status.OK).json({ message: "Reset password successful" });
    }
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ message: error });
  }
};

export {
  login,
  register,
  verifyUser,
  initiateVerifyUser,
  forgetPassword,
  resetPassword,
};
