import dotenv from "dotenv";
import mongoose from "mongoose";

const connectMongoDB = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }catch(error){
        console.error(`Error connection to monogoDB: ${error.message}`);
        process.exit(1);
    }
}

export {connectMongoDB}