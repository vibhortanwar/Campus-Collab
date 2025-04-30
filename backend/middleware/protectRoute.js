const { userModel } = require("../models/user")
const jwt = require("jsonwebtoken");

const protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        if(!token) {
            return res.status(401).json({error: "Unauthorized: No Token Provided"});
        }
        const decoded = jwt.verify(token, process.env.JWT_USER_PASSWORD);
        if(!decoded) {
            return res.status(401).json({error: "Unauthorized: Invalid Token"});
        }
        const user = await userModel.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(404).json({error: "User not found"});
        }
        req.user = user;
        next();
    }catch(error){
        console.log("Error in protectRoute middleware",error.message);
        return res.status(500).json({error:"Internal Server Error"});
    }
}

module.exports = {protectRoute:protectRoute}