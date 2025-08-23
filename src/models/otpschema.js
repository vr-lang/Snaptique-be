const mongoose = require("mongoose")
const validator = require('validator')

const otpschema = mongoose.Schema({
    otp:{
        type:String,
        required : true,
        minlength:6,
        trim: true
    },
    email:{
        type:String,
        required:true,
        validate : function(val){
            const isMailValid = validator.isEmail(val)
            if(!isMailValid){
                throw new error("Please enter a valid email")
            }
        }
    },
    createdAt : {
        type:Date,
        Date : Date.now(),
        expires : 60
    }
})

const OTP = mongoose.model("otp" , otpschema)

module.exports = {
    OTP
}