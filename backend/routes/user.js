import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getUserProfile, updateUser } from "../controllers/user.js";
const userRouter = express.Router();

userRouter.get("/profile/:enrollNo", protectRoute, getUserProfile);
// userRouter.get("/apply/:id", protectRoute, applyUserProfile)
userRouter.post("/update", protectRoute, updateUser);

export {userRouter}