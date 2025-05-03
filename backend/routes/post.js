const { Router } = require("express");
const { protectRoute } = require("../middleware/protectRoute");
const { getAllPosts, getAppliedPosts, getUserPosts, createPost, deletePost, applyConcilePost, getApplicantsForPost } = require("../controllers/post")
const postRouter = Router();

postRouter.get("/all", protectRoute, getAllPosts);
postRouter.get("/applied/:id", protectRoute, getAppliedPosts);
postRouter.get("/user/:enrollNo", protectRoute, getUserPosts);
postRouter.post("/create", protectRoute, createPost);
postRouter.delete("/:id", protectRoute, deletePost);
postRouter.post("/applications/:id",protectRoute,applyConcilePost);
postRouter.get("/applications/:postId", protectRoute, getApplicantsForPost);

module.exports = {
    postRouter: postRouter
}