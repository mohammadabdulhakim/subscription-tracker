import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

export const getUsers = async (req,res, nxt) => {
    try{
        const users = await User.find().select('-password');

        res.status(200).json({success: true, data: users});
    }catch (err){
        nxt(err);
    }
}

export const getUserById = async (req,res, nxt) => {
    try{
        const user = await User.findById(req.params.id).select('-password');

        if(!user){
            const error = new Error("User is not found.");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({success: true, data: user});
    }catch(err){
        nxt(err);
    }
}


export const updateUser = async (req,res, nxt) => {
    try{
        const session = await mongoose.startSession();
        session.startTransaction();
        
        const newUser = {};
        
        if(req.body.name) newUser.name = req.body.name;
        if(req.body.email) newUser.email = req.body.email;

        let updatedUser;
        if(req.body.oldPassword && req.body.newPassword){
            const user = await User.findById(req.userId);

            const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);

            if(isMatch){
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
                newUser.password = hashedPassword;
            }else{
                const error = new Error("Password is incorrect.");
                error.statusCode = 401;
                throw error;
            }

            await User.updateOne({_id: req.userId}, newUser, {session});
            updatedUser = {...user._doc, ...newUser};
        }else {
            updatedUser = await User.findByIdAndUpdate(req.userId, newUser, {new: true, session});
        }
        
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({success: true, data: updatedUser});
    }catch(err){
        nxt(err);
    }
}

export const deleteUser = async (req,res, nxt) => {
    try{
        await User.findByIdAndDelete(req.userId);
        res.status(200).json({success: true, data: null});
    }catch(err){
        nxt(err);
    }
}