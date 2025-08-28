const express = require('express')
const { isLoggedIn } = require('../middlewares/isLoggesIn')
const { followRequest } = require('../models/followRequest')
const { User } = require('../models/userschema')
const router = express.Router()

router.post('/follow-requests/:toUserId',isLoggedIn , async(req , res) =>{
    try {
        const{toUserId} = req.params
        if(toUserId == req.User._id){
            throw new error("Invalid operation")
        }
        // check if request already exist or acccepted
        const foundReq = await followRequest.findOne({fromUserId : req.User._id , toUserId})
        if(foundReq){
            if(foundReq.status == "pending"){
                throw new Error("Request already pending")
            }else if(foundReq.status == "accepted"){
                throw new Error("Already following the user")
            }
        }

        //check if request send to user is exists or not
        const foundUser = await User.findOne({_id : toUserId})
        if(!foundUser){
            throw new Error("User does not exists")
        }
        
        //check if the account is private and make the request pending
        if(foundUser.isPrivate){
            await followRequest.create({toUserId , fromUserId : req.User._id,status:"pending"})
            res.status(200).send({msg : `Request send to username ${foundUser.userName}`})
        }
        // if account is not private the request will automatically accepted
        else{
            await followRequest.create({toUserId , fromUserId : req.User._id , status :"accepted"})
            foundUser.followers.push(req.User._id)
            foundUser.save()
            foundUser.following.push(toUserId)
            foundUser.save()
            res.status(200).send({msg : `Now following ${foundUser.userName}`})
        }
    } catch (error) {
        res.status(400).send({error : error.message})
    }
})

router.patch('/follow-requests/review/:id/:status',isLoggedIn,async(req,res) =>{
 try {
       const{id , status} = req.params
    const foundReq = await followRequest.findOne({_id : id , toUserId : req.User._id})
    if(!foundReq){
        throw new Error("Invalid request/ Invalid operation")
    }

    if(foundReq.status != "pending" ){
        throw new Error("Invalid operation")
    }
    if(status == "rejected"){
        await followRequest.deleteOne({_id : id})
        res.status(200),send({msg : "Request rejected"})
    }
    if(status != "accepted"){
        throw new Error("Invalid status")
    }

    foundReq.status = status
    foundReq.save()
    req.User.followers.push(foundReq.fromUserId)
    req.User.save()

    const senderData = await User.findById(foundReq.fromUserId)
    senderData.following.push(req.User._id)
    senderData.save()

    res.status(200).json({msg : "done"})
 } catch (error) {
    res.status(400).send({error : error.message})
 }
})

module.exports ={
    followRequestRouter : router
}