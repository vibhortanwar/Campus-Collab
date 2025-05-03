const { userModel } = require("../models/user")
const bcrypt = require("bcrypt");
const { z } = require("zod");
const { generateTokenAndSetCookie } = require("../lib/utils/generateToken")

const signup = async (req, res) => {
    const requiredBody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(3).max(30),
        fullName: z.string().min(3).max(100),
        enrollNo: z.string().min(3).max(20)
    });

    const parsedDataWithSuccess = requiredBody.safeParse(req.body);
    if (!parsedDataWithSuccess.success) {
        return res.status(400).json({
            message: "Incorrect format",
            error: parsedDataWithSuccess.error
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
            return res.status(400).json({ error: "Enrollment Number is already in use" });
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
module.exports = {
    signup: signup,
    login: login,
    logout: logout,
    getMe: getMe
}