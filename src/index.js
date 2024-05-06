import connectDB from "./db/index.js"
import { app } from './app.js';
import dotenv from "dotenv"

dotenv.config({
    path: './.env'
})


const port = process.env.PORT || 4000;


connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("err: ",error)
        throw error;
    })
    
    app.listen(port,()=>{
        console.log(`your app is listen is Port no ${port}`);
    })
    
})
.catch((error)=>{
    console.log(`Mongo db Connetions failed !!! ${error}`);
})













/*

import mongoose from "mongoose";
import {DB_NAME} from "./constants.js";
import express from "express";
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 4000;

;(async()=>{
    try {
       await mongoose.connect(`${process.env.MONGOODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("error: ",error);
            throw error;
        })
        app.listen(port,()=>{
            console.log(`Your app is listen Port No ${port}`);
        })
        
    } catch (error) {
        console.log(`Error in Connection in mongoDB: ${error}`);
        throw error;
        
    }
})();
*/