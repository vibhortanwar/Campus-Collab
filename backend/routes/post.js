const { Router } = require("express");
const { protectRoute } = require("../middleware/protectRoute");
const { getAllPosts, getAppliedPosts, getUserPosts, createPost, deletePost, applyConcilePost } = require("../controllers/post")
const postRouter = Router();

postRouter.get("/all", protectRoute, getAllPosts);
postRouter.get("/applied/:id", protectRoute, getAppliedPosts);
postRouter.get("/user/:enrollNo", protectRoute, getUserPosts);
postRouter.post("/create", protectRoute, createPost);
postRouter.delete("/:id", protectRoute, deletePost);
postRouter.post("/applications/:id",protectRoute,applyConcilePost);

module.exports = {
    postRouter: postRouter
}