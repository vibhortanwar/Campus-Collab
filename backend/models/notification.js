import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true
    }, 
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
    count: {
        type: Number,
        default: 1
    }
}, { timestamps: true });
const notificationModel  = mongoose.model('Notification', notificationSchema);

export {notificationModel};