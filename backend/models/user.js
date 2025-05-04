import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    enrollNo: {
        type: String,
        unique: true,
        required: true
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImg: {
        type: String,
    },
    cvFile: {
        type: String, // This will store the PDF URL
        default: null
    },
    ipuRankLink: {
        type: String,
        default: null
    },    
    appliedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: [],
        }
    ]
}, { timestamps: true });

const userModel = mongoose.model("User", userSchema);

export {userModel};