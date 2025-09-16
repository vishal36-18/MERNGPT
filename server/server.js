import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import { chatRouter } from "./routes/chat.js";
import { userRouter } from "./routes/user.route.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use("/api", chatRouter);
app.use("/api", userRouter);

app.listen(PORT, () => {
  console.log(`server listening on port number ${PORT}`);
  connectDB();
})

const connectDB = async() => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("mongodb connected");
  } catch (error) {
    console.log("connection failed", error);
  }
}