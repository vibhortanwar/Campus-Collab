import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getAllPosts,
  getAppliedPosts,
  getUserPosts,
  createPost,
  deletePost,
  applyConcilePost,
  getApplicantsForPost
} from "../controllers/post.js";
const postRouter = Router();

postRouter.get("/all", protectRoute, getAllPosts);
postRouter.get("/applied/:id", protectRoute, getAppliedPosts);
postRouter.get("/user/:enrollNo", protectRoute, getUserPosts);
postRouter.post("/create", protectRoute, createPost);
postRouter.delete("/:id", protectRoute, deletePost);
postRouter.post("/applications/:id",protectRoute,applyConcilePost);
postRouter.get("/applications/:postId", protectRoute, getApplicantsForPost);

export {postRouter}