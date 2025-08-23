require("dotenv").config()
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const {otpRouter} = require('./Routes/otpRoutes.js')

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use("/api", otpRouter)

mongoose.connect(process.env.mongo_url)
.then(() =>{
    console.log("DB Connected")
    app.listen(process.env.PORT,() =>{
        console.log("Server Started")
    })
})
.catch(() =>{
    console.log("DB not connected")
})