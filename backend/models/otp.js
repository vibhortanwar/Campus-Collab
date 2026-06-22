import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // Auto-delete document after 10 minutes
        expires: 600,
    },
});

const otpModel = mongoose.model("OTP", otpSchema);

export { otpModel };
