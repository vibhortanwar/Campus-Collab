import { Router } from "express";
import { signup, login, logout, getMe, sendOtp, verifyOtp } from "../controllers/auth.js";
import { protectRoute } from "../middleware/protectRoute.js";

const authRouter = Router();

authRouter.get("/me", protectRoute, getMe);

authRouter.post("/send-otp", sendOtp);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

export { authRouter };