import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, red: "User", required: true },
  content: { type: String, required: true },
  tags: [String],
  approval: {
    type: String,
    enum: ["Approved", "Pending", "Rejected"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
  imageUrls: [String],
});
const Post = mongoose.model("Post", postSchema);
export default Post;
