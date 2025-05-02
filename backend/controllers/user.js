
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
	const { email, currentPassword, newPassword, confirm, fullName, profileImg } = req.body;
	const userId = req.user._id;

	try {
		let user = await userModel.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found!" });
		}

		// Handle password update
		if (currentPassword || newPassword || confirm) {
			if (currentPassword && newPassword && confirm) {
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
			} else {
				return res.status(400).json({ error: "Please provide all password fields" });
			}
		}

		// Handle profile image update
		if (profileImg && profileImg.startsWith("data:image")) {
			// Delete old image if present
			if (user.profileImg && user.profileImg.includes("cloudinary")) {
				const publicId = user.profileImg
					.split("/")
					.pop()
					.split(".")[0]; // Extract the Cloudinary public ID

				await cloudinary.uploader.destroy(publicId);
			}

			// Upload new image
			const uploadRes = await cloudinary.uploader.upload(profileImg, {
				folder: "user-profiles", // Optional: organize uploads in a folder
			});
			user.profileImg = uploadRes.secure_url;
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