import mongoose from "mongoose";
import {DB_NAME} from "./constants.js";
import express from "express";
import 'dotenv/config';
import connectDB from "./db/index.js"

connectDB()

// const app = express();
// const port = process.env.PORT || 4000;











/*
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