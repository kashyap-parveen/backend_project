import mongoose from "mongoose";

export const userScheme = mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    }
},{timestamps: true})

export const User = mongoose.model("User",userScheme)