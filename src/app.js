//require('dotenv').config()
import express from 'express'

const app = express()
const port = 3000

app.get("/",(req,res)=>{
    res.send("server is ready")
})

app.listen(port,()=>{
    console.log(`User Server is localhost:${port}`);
})