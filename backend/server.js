import express from "express";
import dotenv from "dotenv";
import path from "path";
import { authRouter } from "./routes/auth.js";
import { userRouter } from "./routes/user.js";
import cloudinary from "cloudinary";
import { connectMongoDB } from "./db/db.js";
import cookieParser from "cookie-parser";
import { postRouter } from "./routes/post.js";
import { notificationRouter } from "./routes/notification.js";

const app = express();

cloudinary.v2; 
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 8000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit:'50mb', extended: true }));
app.use(cookieParser());

const __dirname = path.resolve();

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/notifications", notificationRouter);

if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req,res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  })
}

async function main() {
  await connectMongoDB();
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

main();