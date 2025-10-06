import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minLength: 2,
        maxLength: 30,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        minLength: 5,
        maxLength: 255,
        trim: true,
        lowercase: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: 6,
        maxLength: 1024,
    }
}, {timestamps: true})

const User = mongoose.model("User", userSchema);

export default User;