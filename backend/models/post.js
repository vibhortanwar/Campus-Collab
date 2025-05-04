const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text:{
        type:String
    },
    img:{
        type:String,
        default: null
    },
    applications:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    expiresAt: {
        type: Date,
        default: null
    },
    imagePublicId: {
        type: String,
        default: null
    }
},{timestamps: true})

const postModel = mongoose.model("Post",postSchema);

module.exports = {
    postModel: postModel
}