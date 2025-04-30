const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: {
        type:String,
        unique: true,
        required:true,
    },
    enrollNo:{
        type:String,
        unique:true,
        required: true
    },
    fullName:{
        type:String,
        required:true,
    },
    password:{
        type: String,
        required:true,
    },
    profileImg:{
        type: String,
        default:"https://cdn-icons-png.flaticon.com/512/6522/6522516.png",
    },
    appliedPosts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Post",
            default:[],
        }
    ]
}, {timestamps:true});

const userModel = mongoose.model("User", userSchema);

module.exports={
    userModel: userModel
}