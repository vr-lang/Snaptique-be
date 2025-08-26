const express = require('express')
const router = express.Router()
const { verifiedmail } = require('../models/verifiedMail')
const validator = require('validator')
const bcrypt = require('bcrypt')
const { User } = require('../models/userschema')
const jwt = require('jsonwebtoken')


router.post("/auth/signup" , async(req , res) =>{
    try {
        const{firstName , lastName , userName , mail , password , dateOfBirth , gender} = req.body
    if(!firstName || !lastName || !userName || !mail || !password || !dateOfBirth || !gender){
        throw new Error("Please enter all the required feilds")
    }
    const isMailVerified = await verifiedmail.findOne({mail})
    if(!isMailVerified){
        throw new Error("Verify your mail first")
    }

    const ispasswordStrong = validator.isStrongPassword(password)
    if(!ispasswordStrong){
        throw new Error("Please enter a strong password")
    }

    const hashedPassword = await bcrypt.hash(password , 10)

    await User.create({firstName , lastName , userName , mail , password : hashedPassword , dateOfBirth , gender})

    res.status(200).send({"msg" : "done"})
    } catch (error) {
        res.status(400).send({"error" : error.message})
    }
})


router.post('/auth/signin' , async(req,res) =>{
    const{userName , mail , password} = req.body
    const foundUser = await User.findOne({
        $or : [
            {userName},
            {mail}
        ]
    })
    if(!foundUser){
        throw new Error("User not found")
    }

    const isCorrectPassword = await bcrypt.compare(password , foundUser.password)
    if(!isCorrectPassword){
        throw new Error("Invalid credentials")
    }
    const token= jwt.sign({_id : foundUser._id}, process.env.JWT_SECRET,{expiresIn : '24h'})
    res.cookie("jwt-token", token)
    res.status(200).json({msg : "User logged in", data : {
            firstName : foundUser.firstName,
            lastName : foundUser.lastName,
            mail : foundUser.mail,
            userName : foundUser.username,
            gender : foundUser.gender,
            dateOfBirth : foundUser.dateOfBirth,
            bio : foundUser.bio,
            posts : foundUser.posts,
            followers : foundUser.followers,
            following : foundUser.following,
            blocked : foundUser.blocked,
            isPrivate : foundUser.isPrivate,
            profilePicture : foundUser.profilePicture,
    }})
    console.log(foundUser)
})

router.post('/auth/logout',async(req,res) =>{
    res.status(200).cookie("jwt-token", null).json({"msg" : "User logged Out"})
})


module.exports = {
    authRouter : router
}