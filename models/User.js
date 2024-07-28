import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["Admin", "Editor", "Viewer"],
    default: "Viewer",
  },
  profile: {
    contactDetails: { type: String },
    industry: { type: String },
    expertise: { type: String },
    portfolioLinks: [String],
  },
  isVerified: { type: Boolean, default: false },
  verificationToken: {
    type: String,
    default: crypto.randomBytes(32).toString("hex"),
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});
const User = mongoose.model("User", userSchema);
export default User;
