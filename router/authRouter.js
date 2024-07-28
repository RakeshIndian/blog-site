import express from "express";
import {
  forgetPassword,
  initiateVerifyUser,
  login,
  register,
  resetPassword,
  verifyUser,
} from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/initiateuserVerification", initiateVerifyUser);
authRouter.get("/verify-email", verifyUser);
authRouter.post("/login", login);
authRouter.post("/forgetPassword", forgetPassword);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
