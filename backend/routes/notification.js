const { Router } = require("express");
const { protectRoute } = require("../middleware/protectRoute");
const { getNotifications, deleteOneNotification, deleteNotifications } = require("../controllers/notification");
const notificationRouter = Router();

notificationRouter.get("/", protectRoute, getNotifications);
notificationRouter.delete("/", protectRoute, deleteNotifications);
notificationRouter.delete("/:id", protectRoute, deleteOneNotification);

module.exports = {
    notificationRouter: notificationRouter
}