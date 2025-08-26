const { Post } = require("../models/postSchema")



const isAuthor = async(req , res ,next) =>{
    try {
        const{id} = req.params
        const foundPost = await Post.findOne({_id : id})
        if(!foundPost){
            throw new Error("Post not found")
        }
        if(!foundPost.author.equals(req.User._id)){
            throw new Error("You are not authorized for this action")
        }
        next()
    } catch (error) {
        res.status(400).send({error : error.message})
    }
}


module.exports={
    isAuthor
}