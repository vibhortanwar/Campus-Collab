
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

const updateUser = async (req, res) => {
    const { email, currentPassword, newPassword, confirm, fullName, profileImg, cvFile } = req.body;
    const userId = req.user._id;

    try {
        let user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        // Handle password update ONLY if at least one password field is provided
        if (currentPassword || newPassword || confirm) {
            if (!currentPassword || !newPassword || !confirm) {
                return res.status(400).json({ error: "Please provide all password fields" });
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Current password is incorrect" });
            }
            if (newPassword.length < 6 || newPassword.length > 20) {
                return res.status(400).json({ error: "Password must be 6-20 characters long" });
            }
            if (newPassword !== confirm) {
                return res.status(400).json({ error: "New passwords do not match!" });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        // Handle profile image update (if provided)
        if (profileImg && profileImg.startsWith("data:image")) {
            if (user.profileImg && user.profileImg.includes("cloudinary")) {
                const publicId = user.profileImg.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            }

            const uploadRes = await cloudinary.uploader.upload(profileImg, {
                folder: "user-profiles",
            });
            user.profileImg = uploadRes.secure_url;
        }

        // Handle CV file update (if provided)
        if (cvFile && cvFile.startsWith("data:application/pdf")) {
            if (user.cvFile && user.cvFile.includes("cloudinary")) {
                const publicId = user.cvFile.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
            }

            const uploadCv = await cloudinary.uploader.upload(cvFile, {
                resource_type: "raw",
                folder: "user-cvs",
                public_id: `cv_${user.enrollNo}.pdf`,
                overwrite: true,
            });

            user.cvFile = uploadCv.secure_url;
        }

        // Update other profile fields
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;

        await user.save();

        const updatedUser = user.toObject();
        delete updatedUser.password; // Remove password from response

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error in updateUser:", error.message);
        return res.status(500).json({ error: "Server error: " + error.message });
    }
};

module.exports = {
    getUserProfile:getUserProfile,
    updateUser:updateUser
}