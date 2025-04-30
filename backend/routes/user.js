const express = require("express");
const { protectRoute } = require("../middleware/protectRoute");
const { getUserProfile, updateUser } = require("../controllers/user");
const userRouter = express.Router();

userRouter.get("/profile/:enrollNo", protectRoute, getUserProfile);
// userRouter.get("/apply/:id", protectRoute, applyUserProfile)
userRouter.post("/update", protectRoute, updateUser);

module.exports={
    userRouter:userRouter
}