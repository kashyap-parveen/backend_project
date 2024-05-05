import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";
import express from "express";
import 'dotenv/config';

const app = express()


const connectDB = async()=>{
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGOODB_URI}/${DB_NAME}`)
       console.log(`/n MongoDB !! DB Host: ${connectionInstance.connection.host}`);

        
    } catch (error) {
        console.log(`Error in Connection in mongoDB: ${error}`);
        process.exit(1)
        
    }
}
export default connectDB;