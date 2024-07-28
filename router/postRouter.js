import express from "express";
import {
  approvePost,
  createPost,
  getAllPosts,
} from "../controllers/postController";
import authenticate from "../middlewares/authMiddleware";

const postRouter = express.Router();

postRouter.post("/createpost", authenticate, createPost);
postRouter.post("/approve-post", authenticate, approvePost);
postRouter.get("/getposts", authenticate, getAllPosts);

export default postRouter;
