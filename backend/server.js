const express = require("express");
const dotenv = require("dotenv");

const { authRouter } = require("./routes/auth");
const { userRouter } = require("./routes/user");
const cloudinary = require("cloudinary").v2;
const { connectMongoDB } = require("./db/db");
const cookieParser = require("cookie-parser");
const app = express();
const { postRouter } = require("./routes/post")
const { notificationRouter } = require("./routes/notification.js");

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

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/notifications", notificationRouter);

async function main() {
  await connectMongoDB();
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

main();