const { notificationModel } = require("../models/notification");

const getNotifications = async (req, res) => {
    try{
        const userId = req.user._id;
        const notifications = await notificationModel.find({ to: userId}).populate({
            "path": "from",
            select: "enrollNo profileImg"
        });

        await notificationModel.updateMany({to:userId}, {read:true});
         
        res.status(200).json(notifications);
    }catch(error){
        console.log("Error in getNotifications function", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const deleteNotifications = async (req, res) => {
    try{
        const userId = req.user._id;

        await notificationModel.deleteMany({to: userId});

        res.status(200).json({message: "Notifications deleted successfully"});
    }catch(error) {
        console.log("Error in deleteNotifications function", error.message);
        res.status(500).json({error:"Internal sever error"});
    }
}

const deleteOneNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user._id;
        const notification = await notificationModel.findById(notificationId);

        if(!notification){
            return res.status(404).json({error: "Notification not found"});
        }

        if(notification.to.toString() !== userId.toString()){
            return res.status(403).json({error: "You are not allowed to delete this notification"});
        }
        await notificationModel.findByIdAndDelete(notificationId);
        res.status(200).json({error: "Notification deleted Successfully"});
    } catch (error) { 
        console.log("Error in deleteNotification funciton:", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports={
    getNotifications: getNotifications,
    deleteNotifications: deleteNotifications, 
    deleteOneNotification: deleteOneNotification
}