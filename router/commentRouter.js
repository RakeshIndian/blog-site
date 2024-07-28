import express from "express";
import authenticate from "../middlewares/authMiddleware";
import {
  approveComment,
  createComment,
  fetchAllComment,
} from "../controllers/commentController";

const commentRouter = express.Router();
commentRouter.post("/create-comment", authenticate, createComment);
commentRouter.post("/approve-comment", authenticate, approveComment);
commentRouter.get("/getcomments/:postId", authenticate, fetchAllComment);

export default commentRouter;
