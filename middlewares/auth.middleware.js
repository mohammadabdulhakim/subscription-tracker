import jwt from 'jsonwebtoken';
import {JWT_SECRET} from "../config/env.js";
import User from '../models/user.model.js';

const authorize = async(req,res, nxt) => {
    try{

        let token;


        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1];
        }

        if(!token) return res.status(401).json({message: "Unauthorized"});

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId).select('-password');

        if(!user) return res.status(401).json({message: "Unauthorized"});
        
        req.user = user;
        nxt();

    }catch(err){
        res.status(401).json({message: "Unauthorized", error: err.message});
    }
}


export default authorize;    