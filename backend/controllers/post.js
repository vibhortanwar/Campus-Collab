const post = require("../models/post");
const { postModel } = require("../models/post");
const { userModel } = require("../models/user");
const cloudinary = require("cloudinary").v2;
const { notificationModel } = require("../models/notification")
const createPost = async (req, res) => {
    try {
        const { text, img, expiresAt } = req.body; // accept expiresAt
        const userId = req.user._id;
      let expiresAtUTC = null;
  
      if (!text && !img) {
        return res.status(400).json({ error: "Post must have text or image" });
      }
  
      let imageUrl = null;
      let imagePublicId = null;
  
      // ✅ Upload image to Cloudinary if exists
      if (img) {
        const uploadedResponse = await cloudinary.uploader.upload(img, {
          folder: "posts",
        });
        imageUrl = uploadedResponse.secure_url;
        imagePublicId = uploadedResponse.public_id;
      }
      if (expiresAt) {
        const localDate = new Date(expiresAt); // from frontend in IST
        if (!isNaN(localDate)) {
          expiresAtUTC = new Date(localDate.toISOString()); // stores in UTC
        }
      }
      // ✅ Create the post (without expiresAt)
 
        const newPost = new postModel({
            user: userId,
            text,
            img: imageUrl,
            imagePublicId,
            expiresAt: expiresAtUTC,
        });
    
      await newPost.save();
      res.status(201).json(newPost);
    } catch (error) {
      console.error("Error creating post:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

const deletePost = async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        if(!post) {
            return res.status(404).json({error: "Post not found"})
        }
        if(post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({error: "You are not authorized to delete this post"});
        }
        if(post.image) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await postModel.findByIdAndDelete(req.params.id);

        res.status(200).json({message: "Post deleted Successfully"});
    }catch(error){
        console.log("Error in deletePost controller: ", error);
        res.status(500).json({error: "Internal server error"});
    }
};

const applyConcilePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id: postId } = req.params;

        const post = await postModel.findById(postId);
        if (!post) return res.status(404).json({ error: "Post not found" });

        // ✅ Prevent applying after deadline
        if (post.expiresAt && new Date(post.expiresAt) <= new Date()) {
            return res.status(403).json({ error: "Deadline has passed. Cannot apply." });
        }

        const hasApplied = post.applications.includes(userId);

        if (hasApplied) {
            // ✅ WITHDRAW application
            await postModel.updateOne(
                { _id: postId },
                { $pull: { applications: userId } }
            );

            await userModel.updateOne(
                { _id: userId },
                { $pull: { appliedPosts: postId } }
            );

            await post.save();

            const updatedPost = await postModel.findById(postId);
            const applicationCount = updatedPost.applications.length;

            if (applicationCount === 0) {
                await notificationModel.deleteOne({
                    to: post.user,
                    type: "applied",
                    post: postId
                });
            } else {
                await notificationModel.updateOne(
                    { to: post.user, type: "applied", post: postId },
                    { $set: { count: applicationCount } }
                );
            }

            return res.status(200).json({ message: "Application conciled successfully" });

        } else {
            // ✅ APPLY to post
            post.applications.push(userId);
            await post.save();

            await userModel.updateOne(
                { _id: userId },
                { $addToSet: { appliedPosts: postId } }
            );

            const applicationCount = post.applications.length;

            const existingNotification = await notificationModel.findOne({
                to: post.user,
                type: "applied",
                post: postId
            });

            if (existingNotification) {
                existingNotification.count = applicationCount;
                await existingNotification.save();
            } else {
                const notification = new notificationModel({
                    from: userId,
                    to: post.user,
                    type: "applied",
                    post: postId,
                    count: applicationCount
                });
                await notification.save();
            }

            return res.status(200).json({ message: "Applied for the post successfully" });
        }
    } catch (error) {
        console.log("Error in applyConcilePost controller:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const getAllPosts = async (req, res) => {
    try{
        const posts = await postModel.find().sort({createdAt: -1}).populate({
            path: "user",
            select:"-password"
        });

        if (posts.length === 0) {
            return res.status(200).json([]);
        }
        res.status(200).json(posts);
    }catch(error){
        console.log("Error in get All posts controller: ", error);
        res.status(500).json({error: "Internal server error"});
    }
};

const getAppliedPosts = async (req,res) => {
    const userId = req.params.id;
    try{
        const user = await userModel.findById(userId);
        if(!user) return res.status(404).json({error: "User not found"});
        
        const appliedPosts = await postModel.find({_id: {$in: user.appliedPosts}})
        .populate({
            path: "user",
            select: "-password"
        });

        res.status(200).json(appliedPosts);
    }catch(error){
        console.log("Error in getAppliedPosts controller: ", error);
        res.status(500).json({error: "Internal server error" });
    }
}

const getUserPosts = async (req, res) => {
    try {
        const { enrollNo } = req.params;

        const user = await userModel.findOne({enrollNo});

        const posts = await postModel.find({user:user._id}).sort({createdAt: -1}).populate({
            path: "user",
            select: "-password"
        })
        res.status(200).json(posts);
    } catch (error) {
        console.log("Error in getUserPosts controller: ", error);
        res.status(500).json({error: "Internal server error"})
    }
}
const getApplicantsForPost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user._id; // Assuming `req.user` is populated by the `protectRoute` middleware
  
    try {
      // Find the post by ID
      const post = await postModel.findById(postId).populate('applications');
  
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      // Check if the authenticated user is the owner of the post
      if (post.user.toString() !== userId.toString()) {
        return res.status(403).json({ error: 'You are not authorized to view applicants for this post' });
      }
  
      // Return the list of applicants
      const applicants = post.applications.map(applicant => ({
        _id: applicant._id,
        fullName: applicant.fullName,
        enrollNo: applicant.enrollNo,
        profileImg: applicant.profileImg,
      }));
  
      res.status(200).json({ applicants });
    } catch (error) {
      console.error("Error fetching applicants:", error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  };

module.exports = {
    createPost: createPost,
    deletePost: deletePost,
    applyConcilePost: applyConcilePost,
    getAllPosts: getAllPosts,
    getAppliedPosts: getAppliedPosts,
    getUserPosts: getUserPosts,
    getApplicantsForPost: getApplicantsForPost
}  