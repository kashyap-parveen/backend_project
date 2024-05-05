import 'dotenv/config'
import express from 'express'
import mongoose from "mongoose"
import User from "./models/user.model"

const app = express()
const port = process.env.PORT || 4000

app.get("/",(req,res)=>{
    res.send("server is ready")
})

app.listen(port,()=>{
    console.log(`User Server is localhost:${port}`);
})