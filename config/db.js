import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_DB_URL);
    console.log("Mongodb is connected");
  } catch (error) {
    console.log("Unable to connect");
    process.exit(1);
  }
};
export default connectDB;
