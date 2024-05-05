import mongoose from "mongoose";
import {DB_NAME} from "./constants";
import express from "express";
import 'dotenv/config';



const app = express();
const port = process.env.PORT || 4000;

;(async()=>{
    try {
        mongoose.connect(`${process.env.MONGOODB_URI}/${DB_NAME}`)
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