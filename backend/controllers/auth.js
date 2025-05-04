import { userModel } from "../models/user.js";
import bcrypt from "bcrypt";
import { z } from "zod";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

const signup = async (req, res) => {
    const requiredBody = z.object({
        email: z.string().email().regex(/^[a-zA-Z0-9._%+-]+@ipu\.ac\.in$/, "Must be an @ipu.ac.in email"),
        password: z.string().min(8, { message: "Password must be at least 8 characters long" }).max(30, { message: "Password must be at most 30 characters" }),
        fullName: z.string(),
        enrollNo: z.string().min(11, { message: "Enter valid Enrollment No." }).max(11, { message: "Enter valid Enrollment No." }),
    });

    const parsedDataWithSuccess = requiredBody.safeParse(req.body);
    if (!parsedDataWithSuccess.success) {
        // Map through the issues and extract only the message
        const errorMessages = parsedDataWithSuccess.error.issues.map(issue => issue.message);

        return res.status(400).json({
            message: "Validation failed",
            errors: errorMessages // Only messages are returned
        });
    }

    const { email, password, fullName, enrollNo } = req.body;

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
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};


const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(403).json({
                message: "User not found!"
            })
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(passwordMatch){
            generateTokenAndSetCookie(user._id,res);

            res.status(200).json({
                _id: user._id,
                email: user.email,
                fullName: user.fullName,
                profileImg: user.profileImg,
                enrollNo: user.enrollNo
            });

        }else{
            return res.status(403).json({
                message: "Invalid email or password"
            });
        }
    }catch(error) {
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
}
const logout = async (req, res) => {
    try {
        res.cookie("jwt","", {maxAge:0})
        res.status(200).json({message:"Logged out successfully"});
    }catch(error){
        console.log("Error in logout controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}
const getMe = async(req,res) => {
    try{
        const user = await userModel.findById(req.user._id).select("-password");
        res.status(200).json(user);
    }catch(error){
        console.log("Error in getMe controller", error.message);
        res.status(500).json({ error: "Internal Server Error" })
    }
}
export { signup, login, logout, getMe };