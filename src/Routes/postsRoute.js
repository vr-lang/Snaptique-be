const express = require('express')
const { Post } = require('../models/postSchema')
const { isLoggedIn } = require('../middlewares/isLoggesIn')
const { isAuthor } = require('../middlewares/isAuthor')
const router = express.Router()

router.post('/posts/create',isLoggedIn , async(req , res) =>{
    try {
        const{caption , location  , media } = req.body
        if(!media){
            throw new Error("Please post atleast one media file.")
        }

        const newPost = await Post.create({caption , location , media , author : req.User._id})
        req.User.posts.push(newPost._id)
        await req.User.save()
        res.status(200).send({msg : "Done" , data : newPost })
    } catch (error) {
        res.status(400).send({error : error.message  })
        console.log(error)
    }
})

router.get('/posts',isLoggedIn,async(req,res) =>{
    try {
        const allPosts = await Post.find({author : req.User._id})
        res.status(200).send({data : allPosts})
    } catch (error) {
        res.status(400).send({error : error.message})
    }
})

router.get('/posts/:id',isLoggedIn,isAuthor, async(req,res) =>{
    try {
        const{id} = req.params
        const onePost = await Post.findOne({
            $and :[
                {_id : id},
                {author : req.User._id}
            ]
        })
        res.status(200).send({data : onePost})
    } catch (error) {
        res.status(400).send({error : error.message})
    }
})

router.delete('/posts/delete/:id' , isLoggedIn,isAuthor , async(req,res) =>{
    try {
        const{id} = req.params
        await Post.deleteOne({_id : id})
        res.status(200).send({msg :"Post Deleted Successfully"})
    } catch (error) {
        res.status(400).send({error : error.message})
    }
})



module.exports = {
    postsRouter : router
}