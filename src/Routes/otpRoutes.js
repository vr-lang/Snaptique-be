const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const { verifiedmail } = require('../models/verifiedMail')
const {OTP} = require("../models/otpschema")
const {otpLimiter} = require('../middlewares/otpMiddleware')

const transporter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : process.env.MAIL_ID,
        pass : process.env.APP_PASSWORD
    }
})

function generateotp(){
    const otp = String(Math.floor(Math.random() * 1000000)).padStart(6, "0")
    return otp
}

router.post("/otp/send-otp", otpLimiter ,async(req , res) =>{

   try {
     const {email} = req.body

     const foundUser = await verifiedmail.findOne({mail : email})
     if(foundUser){
        throw new Error("Mail already Verified")
     }
     const otp = generateotp()
     await OTP.create({email : email, otp, createdAt : Date.now()})
     console.log(otp)

    await transporter.sendMail({
    from: '"Yuvarj" <yuvrajisking66@gmail.com>',
    to: email,
    subject: "Your OTP Code",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
      <h2 style="color: #333;">Hello,</h2>
      <p style="font-size: 16px; color: #555;">
        Thank you for using our service. Here is your OTP code:
      </p>
      <div style="font-size: 24px; color: #2E86C1; font-weight: bold; margin: 20px 0; padding: 10px; background-color: #e8f4fd; border-radius: 6px; text-align: center;">
        <!-- You can dynamically insert the OTP here -->
        <span>${otp}</span>
      </div>
      <p style="font-size: 14px; color: #777;">
        If you did not request this, please ignore this email or contact support.
      </p>
      <p style="font-size: 14px; color: #777;">
        Best regards,<br/>
        Yuvarj Team
      </p>
    </div>
    `
});

    res.status(200).json({msg :"done"})
   } catch (error) {
    res.status(400).send({msg : error.message})
   }
})

router.post("/otp/verify-otp" , async(req,res) =>{
    try {   
        const {email , otp} = req.body
    const foundUser = await verifiedmail.findOne({mail: email})
    if(foundUser){
        throw new Error("User already verified")
    }
    const foundOtp = await OTP.findOne({
        $and : [
            {
                email : email
            },
            {
                otp : otp
            }
        ]
    })
    if(!foundOtp){
        throw new Error("Verification failed")
    }
    await verifiedmail.create({mail : email})
    res.status(200).send({msg : "Mail Verified"})
    } catch (error) {
        res.status(400).send({msg : error.message})
    }
})


module.exports = {
    otpRouter : router
}
