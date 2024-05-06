import express from 'express'
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}));

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true, limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

//routes
import userRouter from './routes/user.routes.js';

// routes declaration

app.use("/api/v1/users",userRouter);


export { app };



/*
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
*/