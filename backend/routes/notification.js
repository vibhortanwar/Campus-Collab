import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getNotifications,
  deleteOneNotification,
  deleteNotifications
} from "../controllers/notification.js";
const notificationRouter = Router();

notificationRouter.get("/", protectRoute, getNotifications);
notificationRouter.delete("/", protectRoute, deleteNotifications);
notificationRouter.delete("/:id", protectRoute, deleteOneNotification);

export {notificationRouter}