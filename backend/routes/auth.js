const { Router } = require("express");
const { signup, login, logout, getMe } = require("../controllers/auth");
const authRouter=Router();
const { protectRoute } = require("../middleware/protectRoute");

authRouter.get("/me", protectRoute, getMe);

authRouter.post("/signup", signup);

authRouter.post("/login", login);

authRouter.post("/logout", logout);


module.exports={
    authRouter: authRouter
}