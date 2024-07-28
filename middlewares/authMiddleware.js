import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: "No token, authorization denied" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    res.status(httpStatus.UNAUTHORIZED).json({
      message: "No token, authorization denied",
    });
  }
};
export default authenticate;
