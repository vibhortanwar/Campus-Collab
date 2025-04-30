
const { userModel } = require("../models/user");
const bcrypt = require("bcrypt");
const cloudinary = require('cloudinary').v2;
const { notificationModel } = "../models/notification";


const getUserProfile = async (req, res) => {
    const { enrollNo } = req.params;

    try{
        const user = await userModel.findOne({enrollNo}).select("-password");
        if(!user) {
            return res.status(404).json({message: "User not found"})
        }
        res.status(200).json(user)
    }catch (error) {
        console.log("Error in getUserProfile: ", error.message);
        res.status(500).json({error:error.message});
    }
};

const updateUser = async (req, res)=>{
    console.log(req.body);
    const { email, currentPassword, newPassword, confirm, fullName } = req.body;
    let { profileImg } = req.body;

    const userId = req.user._id;

    try{
        let user = await userModel.findById(userId);
        if(!user) return res.status(404).json({ message: "User not found!" });
        if(newPassword || currentPassword || confirm){
            if(currentPassword && newPassword && confirm){
                const isMatch = await bcrypt.compare(currentPassword, user.password);
                if(!isMatch) return res.status.json({error:"Current password is incorrect"});
                if(newPassword.length<3 || newPassword.length>20){
                    return res.status(400).json({ error: "Paaword must be at least 6 character long" });
                }
                if(newPassword != confirm) return res.status(400).json({ error: "New Passwords do not Match!" });
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(newPassword, salt);
            }else{
                return res.status(400).json({error: "Please provide complete information"});
            }
        }
        if(profileImg){
            if(user.profileImg){
                await  cloudinary.uploader.destroy(user.profileImg.split("/").pop().split("."))
            }
            const uploadedResponse = await cloudinary.uploader.upload(profileImg);
            profileImg=uploadedResponse.secure_url;
        }

        user.fullName = fullName || user.fullName;
        user.profileImg = profileImg || user.profileImg;

        user = await user.save();

        user.password = null;

        return res.status(200).json(user);

    }catch(error){
        console.log("Error in updateUser: ", error.message);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getUserProfile:getUserProfile,
    updateUser:updateUser
}