import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "./../models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

export const signUp = async (req,res, nxt) =>{
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const {name, email, password} = req.body;

        const existingUser = await User.findOne({email});

        if(existingUser){
            const error = new Error("User is already exists.");
            error.statusCode = 409;
            throw error;
        }

        // Hashing Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create([{name, email, password: hashedPassword}], {session});

        const token = jwt.sign({userId: newUser[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});


        await session.commitTransaction();
        session.endSession();


        res.status(201).json({
            success: true,
            message: "You are signed in successfully",
            data: {
                token,
                user: newUser[0],
            }
        })
    }catch(err){
        await session.abortTransaction();
        session.endSession();
        nxt(err);
    }
}


export const signIn = async (req,res, nxt) =>{
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            const error = new Error("User is not found.");
            error.statusCode = 404;
            throw error;
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(isMatch){
            const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

            res.status(200).json({
                success: true,
                message: "You are signed in successfully",
                data: {
                    token,
                    user,
                }
            })
        }else {
            const error = new Error("Password is incorrect.");
            error.statusCode = 401;
            throw error;
        }
    }catch(err){
       nxt(err);
    }
}


export const signOut = (req,res, nxt) =>{
    
}