const mongoose = require('mongoose')
const validator = require('validator')

const verifiedMailSchema = mongoose.Schema({
    mail :{
        type:String,
        required : true,
        trim: true,
        validate : function(val){
            const isMailValid = validator.isEmail(val)
            if(!isMailValid){
                throw new error("Please enter a valid email")
            }
        }
    }
})

const verifiedmail = mongoose.model("verifiedMail", verifiedMailSchema)

module.exports = {
    verifiedmail
}