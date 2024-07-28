import httpStatus from "http-status";
import Post from "../models/Post";
import User from "../models/User";

export const createPost = async (req, res) => {
  const { title, content, tags } = req.body;
  const author = req.user.id;
  try {
    const post = new Post({ title, author, content, tags });
    await post.save();
    res.status(httpStatus.CREATED).json({ message: post });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const allPosts = await Post.find({ approval: "Approved" });
    console.log("allPosts ", allPosts);
    res.status(httpStatus.OK).json({ message: allPosts });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error });
  }
};

export const getPostByPagination = async (req, res) => {
  const { page = 1, limit = process.env.PAGINATION_LIMIT } = req.query;
  try {
    const posts = await Post.find({ approval: "Approved" })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Post.countDocuments({ status: "Approved" });
    res.status(httpStatus.OK).json({
      message: posts,
      totalPosts: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: error,
    });
  }
};

export const approvePost = async (req, res) => {
  const { postId } = req.body;
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (user && user.role === "Admin") {
      const post = await Post.findByIdAndUpdate(
        postId,
        {
          approval: "Approved",
        },
        {
          new: true,
        }
      );
      console.log(post);
      res.status(httpStatus.OK).json({ message: post });
    } else {
      res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "User is not an admin user" });
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error });
  }
};
