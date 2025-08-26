const mongoose = require("mongoose")
const validator = require('validator')

function calculateAge(dateString){
    const birthDate = new Date(dateString);
    if (isNaN(birthDate)) {
        throw new Error("Invalid date format. Use yyyy-mm-dd");
    }
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
}

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minlength : 2,
        maxlength : 15,
        trim : true
    },
    lastName : {
        type : String,
        required : true,
        minlength : 2,
        maxlength : 15,
        trim : true
    },
    userName : {
        type : String,
        required : true,
        minlength : 2,
        trim : true,
        unique : true
    },
    mail : {
        type : String,
        trim : true,
        required : true,
        unique :true,
        minlength : 6,
        validate : function(val){
            const isvalidEmail = validator.isEmail(val)
            if(!isvalidEmail){
                throw new Error("Please enter a valid email")
            }
        }
    },
    password : {
        type : String,
        required : true,
        minlength : 8,
        trim : true
    },
    dateOfBirth : {
        type : String,
        required : true,
        validate : function(val){
            const isDate = validator.isDate(val)

            if(!isDate){
                throw new Error("Please enter a valid date")
            }

            const age = calculateAge(val)
            if(age<18){
                throw new Error("Your age should be above 18")
            }
        }

    },
    gender : {
        type : String,
        required : true,
        enum : {
            values : ["male", "female", "others"],
            message : "{VALUE} is not a valid type for Gender"
        }
    },
    bio : {
        type : String,
        minlength : 4,
        trim : true
    },
    posts:[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Post"
    }],
    profilePicture : {
        type : String
    },
    followers : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }],
    following : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }],
    blocked : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }],
    isPrivate  : {
        type : Boolean,
        default : false
    }
} , {timestamps : true})

const User = mongoose.model("User" , userSchema)
module.exports = {
    User
}