const mongoose = require('mongoose')

const followRequestSchema = new mongoose.Schema({
    fromUserId :{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        immutable : true,
        ref : "User"
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        immutable : true,
        ref : "User"
    },
    status:{
        type : String,
        required: true,
        enum : {
            values : ["pending" , "accepted" , "rejected"],
            message : "{VALUES} is not a valid status"
        }
    }
})

const followRequest = mongoose.model("FollowRequest" , followRequestSchema)

module.exports = {
    followRequest
}