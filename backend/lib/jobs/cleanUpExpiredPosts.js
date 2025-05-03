const cron = require("node-cron");
const { postModel } = require("../../models/post");
const cloudinary = require("cloudinary").v2;

// Runs at 2 AM every Sunday
cron.schedule("0 2 * * 0", async () => {
    try {
      const now = new Date();
      const expiredPosts = await postModel.find({ expiresAt: { $lte: now } });
  
      for (const post of expiredPosts) {
        if (post.imagePublicId) {
          await cloudinary.uploader.destroy(post.imagePublicId);
        }
        await postModel.deleteOne({ _id: post._id });
      }
  
      if (expiredPosts.length) {
        console.log(`[Cleanup] Deleted ${expiredPosts.length} expired posts`);
      } else {
        console.log("[Cleanup] No expired posts found this week.");
      }
    } catch (error) {
      console.error("[Cleanup Error]", error.message);
    }
  });
  