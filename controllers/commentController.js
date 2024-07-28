import httpStatus from "http-status";
import Comment from "../models/Comment";
import User from "../models/User";

export const createComment = async (req, res) => {
  const { content, postId } = req.body;
  try {
    const userId = req.user.id;
    console.log("user ", userId);
    const comment = new Comment({ content, author: userId, post: postId });
    await comment.save();
    res.status(httpStatus.CREATED).json({
      message: comment,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error });
  }
};

export const approveComment = async (req, res) => {
  const { commentId } = req.body;
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (user.role == "Admin") {
      console.log(user);
      const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
          status: "Approved",
        },
        {
          new: true,
        }
      );
      await comment.save();
      res.status(httpStatus.OK).json({ message: comment });
    } else {
      res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "User is not admin" });
    }
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

export const fetchAllComment = async (req, res) => {
  const { postId } = req.params;
  try {
    const allComments = await Comment.find({
      post: postId,
      status: "Approved",
    });
    res.status(httpStatus.OK).json({ message: allComments });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

export const fetchCommitPaginated = async (req, res) => {
  const { postId } = req.params;
  const { page = 1, limit = 15 } = req.query;
  try {
    const comments = await Comment.find({ post: postId, status: "Approved" })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Comment.countDocuments({ status: "Approved" });
    res.status(httpStatus.OK).json({
      message: comments,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error });
  }
};
