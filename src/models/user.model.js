import mongoose from "mongoose";

export const userScheme = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
},{timestamps: true})

export const User = mongoose.model("User",userScheme)