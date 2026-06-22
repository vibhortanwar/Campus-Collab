import { userModel } from "../models/user.js";
import { otpModel } from "../models/otp.js";
import bcrypt from "bcrypt";
import { z } from "zod";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import { sendOtpEmail } from "../lib/utils/sendEmail.js";

// ─── Send OTP ─────────────────────────────────────────────────────────────────

const sendOtp = async (req, res) => {
    const { email } = req.body;

    // Validate email format
    const emailSchema = z
        .string()
        .email()
        .regex(/^[a-zA-Z0-9._%+-]+@ipu\.ac\.in$/, "Must be an @ipu.ac.in email");

    const result = emailSchema.safeParse(email);
    if (!result.success) {
        return res.status(400).json({ error: result.error.issues[0].message });
    }

    try {
        // Check if email is already registered
        const existingEmail = await userModel.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email is already registered" });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Remove any previous OTPs for this email and save the new one
        await otpModel.deleteMany({ email });
        await otpModel.create({ email, otp });

        // Send email
        await sendOtpEmail(email, otp);

        return res.status(200).json({ message: "OTP sent successfully" });
    } catch (e) {
        console.error("Error in sendOtp controller", e.message);
        return res.status(500).json({ error: "Failed to send OTP. Please try again." });
    }
};

// ─── Verify OTP ───────────────────────────────────────────────────────────────

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ error: "Email and OTP are required" });
    }

    try {
        const record = await otpModel.findOne({ email });

        if (!record) {
            return res.status(400).json({ error: "OTP expired or not found. Please request a new one." });
        }

        if (record.otp !== otp.trim()) {
            return res.status(400).json({ error: "Invalid OTP. Please try again." });
        }

        // OTP is valid — delete it so it can't be reused
        await otpModel.deleteOne({ email });

        return res.status(200).json({ message: "OTP verified successfully" });
    } catch (e) {
        console.error("Error in verifyOtp controller", e.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// ─── Signup ───────────────────────────────────────────────────────────────────

const signup = async (req, res) => {
    const requiredBody = z.object({
        email: z.string().email().regex(/^[a-zA-Z0-9._%+-]+@ipu\.ac\.in$/, "Must be an @ipu.ac.in email"),
        password: z.string().min(8, { message: "Password must be at least 8 characters long" }).max(30, { message: "Password must be at most 30 characters" }),
        fullName: z.string(),
        enrollNo: z.string().min(11, { message: "Enter valid Enrollment No." }).max(11, { message: "Enter valid Enrollment No." }),
        otpVerified: z.boolean({ required_error: "OTP verification is required" }),
    });

    const parsedDataWithSuccess = requiredBody.safeParse(req.body);
    if (!parsedDataWithSuccess.success) {
        const errorMessages = parsedDataWithSuccess.error.issues.map(issue => issue.message);
        return res.status(400).json({
            message: "Validation failed",
            errors: errorMessages
        });
    }

    const { email, password, fullName, enrollNo, otpVerified } = req.body;

    if (!otpVerified) {
        return res.status(400).json({ error: "Please verify your email with OTP before signing up." });
    }

    try {
        const existingEmail = await userModel.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email is already taken" });
        }

        const existingNo = await userModel.findOne({ enrollNo });
        if (existingNo) {
            return res.status(400).json({
                message: "Validation failed",
                error: "Enrollment Number is already in use"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 5);
        const ipuRankLink = `http://ipuranklist.com/student/${enrollNo}`;

        const newUser = await userModel.create({
            email,
            password: hashedPassword,
            fullName,
            enrollNo,
            ipuRankLink
        });

        generateTokenAndSetCookie(newUser._id, res);

        return res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            enrollNo: newUser.enrollNo,
            profileImg: newUser.profileImg,
            ipuRankLink: newUser.ipuRankLink
        });

    } catch (e) {
        console.error("Error in signup controller", e.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// ─── Login ────────────────────────────────────────────────────────────────────

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(403).json({ message: "User not found!" });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            generateTokenAndSetCookie(user._id, res);
            res.status(200).json({
                _id: user._id,
                email: user.email,
                fullName: user.fullName,
                profileImg: user.profileImg,
                enrollNo: user.enrollNo
            });
        } else {
            return res.status(403).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ─── Logout ───────────────────────────────────────────────────────────────────

const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ─── Get Me ───────────────────────────────────────────────────────────────────

const getMe = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getMe controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export { signup, login, logout, getMe, sendOtp, verifyOtp };