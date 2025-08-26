const jwt = require("jsonwebtoken")
const { User } = require("../models/userschema")

const isLoggedIn = async(req , res,next) =>{
   try {
     const{token} = req.cookies
    const decodedToken = jwt.verify(token , process.env.JWT_SECRET)
    const foundUser = await User.findOne({_id : decodedToken._id})

    if(!foundUser){
        throw new Error("Please login first")
    }
    req.User = foundUser
    next()
   } catch (error) {
    res.status(400).send({error : error.message})
    console.log(error)
   }
}

module.exports = {
    isLoggedIn
}