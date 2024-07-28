import express from "express";
import authRouter from "./router/authRouter";
import dotenv from "dotenv";
import connectDB from "./config/db";
import postRouter from "./router/postRouter";
import commentRouter from "./router/commentRouter";

dotenv.config();

const app = express();
app.use(express.json());

// using routers
app.use("/api/auth", authRouter);
app.use("/api/blog", postRouter);
app.use("/api/comments", commentRouter);

//for testing
app.get("/", (req, res) => {
  res.json({
    data: "hello",
  });
});

//error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(process.env.PORT, () => {
  console.log("server running on port " + process.env.PORT);
  connectDB();
});
