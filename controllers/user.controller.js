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


export const updateUser = (req,res, nxt) => {
    try{
        
        const newUser = {};
        if(req.body.name) newUser.name = req.body.name;
        if(req.body.email) newUser.email = req.body.email;
        
        const user = User.findByIdAndUpdate(req.params.id, newUser, {new: true}).select('-password');


        res.status(200).json({success: true, data: user});
    }catch(err){
        nxt(err);
    }
}