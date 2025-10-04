import mongoose from "mongoose";
import {DB_URI, NODE_ENV} from "../config/env.js";


if(!DB_URI) throw new Error("DB_URI is not defined inside .env.<production/development>.local");


const connectToDB = async()=>{
    try{
        await mongoose.connect(DB_URI);
        console.log("Connected to DB in", NODE_ENV, "mode");
    }catch (err){
        console.log("Error while connecting to DB: ", err);
        process.exit(1);
    }
}

export default connectToDB;