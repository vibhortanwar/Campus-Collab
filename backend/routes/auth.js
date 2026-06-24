import { Router } from "express";
import { signup, login, logout, getMe, googleVerify } from "../controllers/auth.js";
import { protectRoute } from "../middleware/protectRoute.js";

const authRouter = Router();

authRouter.get("/me", protectRoute, getMe);

authRouter.get("/google-client-id", (req, res) => {
    res.json({ clientId: process.env.GOOGLE_CLIENT_ID });
});
authRouter.post("/google-verify", googleVerify);
authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

export { authRouter };