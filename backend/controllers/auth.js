import { userModel } from "../models/user.js";
import bcrypt from "bcrypt";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

// ─── Google Verify ─────────────────────────────────────────────────────────────

const googleVerify = async (req, res) => {
    const { credential } = req.body;
    if (!credential) {
        return res.status(400).json({ error: "Google credential is required" });
    }

    try {
        // Verify with Google tokeninfo API
        const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
        if (!googleRes.ok) {
            return res.status(400).json({ error: "Invalid Google credential" });
        }

        const payload = await googleRes.json();
        
        // Verify audience matches our Client ID
        if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
            return res.status(400).json({ error: "Invalid client ID in Google credential" });
        }

        // Verify email domain is @ipu.ac.in
        const email = payload.email;
        if (!email || !email.endsWith("@ipu.ac.in")) {
            return res.status(400).json({ error: "Only @ipu.ac.in email addresses are allowed." });
        }

        // Find if user is already registered
        const user = await userModel.findOne({ email });
        if (user) {
            // Log the user in
            generateTokenAndSetCookie(user._id, res);
            return res.status(200).json({
                status: "login",
                user: {
                    _id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                    profileImg: user.profileImg || payload.picture || "",
                    enrollNo: user.enrollNo
                }
            });
        }

        // If user does not exist, return signup token
        // Sign a signup token that is valid for e.g. 10m
        const signupToken = jwt.sign({ email }, process.env.JWT_USER_PASSWORD, { expiresIn: "10m" });

        return res.status(200).json({
            status: "signup",
            signupToken,
            email,
            fullName: payload.name || ""
        });

    } catch (e) {
        console.error("Error in googleVerify controller", e.message);
        return res.status(500).json({ error: "Internal Server Error during Google verification" });
    }
};

// ─── Signup ───────────────────────────────────────────────────────────────────

const signup = async (req, res) => {
    const requiredBody = z.object({
        signupToken: z.string({ required_error: "Signup token is required" }),
        password: z.string().min(8, { message: "Password must be at least 8 characters long" }).max(30, { message: "Password must be at most 30 characters" }),
        fullName: z.string(),
        enrollNo: z.string().min(11, { message: "Enter valid Enrollment No." }).max(11, { message: "Enter valid Enrollment No." }),
    });

    const parsedDataWithSuccess = requiredBody.safeParse(req.body);
    if (!parsedDataWithSuccess.success) {
        const errorMessages = parsedDataWithSuccess.error.issues.map(issue => issue.message);
        return res.status(400).json({
            message: "Validation failed",
            errors: errorMessages
        });
    }

    const { signupToken, password, fullName, enrollNo } = req.body;

    try {
        // Decode the signupToken to get the email
        let decoded;
        try {
            decoded = jwt.verify(signupToken, process.env.JWT_USER_PASSWORD);
        } catch (err) {
            return res.status(400).json({ error: "Invalid or expired registration token. Please verify with Google again." });
        }

        const email = decoded.email;
        if (!email || !email.endsWith("@ipu.ac.in")) {
            return res.status(400).json({ error: "Invalid registration token email." });
        }

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

export { signup, login, logout, getMe, googleVerify };