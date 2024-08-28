const Comment = require("../models/commentSchema");
const mongoose = require("mongoose");

const addComment = async (req, res) => {
    const {content}  = req.body;
    const author = req.user.fullName;
    const blogId = req.params.blogId
    const authorId = req.user.id
    

    if(!author){
        res.status(400).send("Login required..")
    }
    if(!content){
        return res.status(400).send("Contents is required.")
    }
    try {
        const comment = await Comment.create({
            author,
            content,
            blogId,
            authorId
        });

        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json('Failed to add comment' );
    }
};



const fetchComment = async (req,res) =>{
    const blogId = req.params.blogId
    
    try {
        const comments = await Comment.find({blogId:blogId}).sort({"createdAt":-1})
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json('Failed to fetch comments' );
    }
}



// delete comments
const deleteComment = async(req,res) =>{
    const commentId = req.params.CommentId;
    const authorId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(authorId)) {
        return res.status(400).json('Invalid Id format, Login again' );

    }

    try {
        const comments = await Comment.findById({_id:commentId})
        if(comments.authorId == authorId){
            await Comment.findByIdAndDelete({_id:commentId})
            res.status(200).send("Comments successfully deleted.")
        }
        else{
            res.status(400).send("You don't have access to deleted this comment.")
        }

     
        
    } catch (error) {
        res.status(500).json('Failed to delete comments' );
    }
}

// edit
const editComments = async(req,res)=>{
    const commentId = req.params.CommentId;
    const {content} = req.body;
    const authorId = req.user.id;
    

    if(!content){
        return res.status(400).send("Content is required.")
    }

    try {
        const comments = await Comment.findById({_id:commentId})
        
        if(comments.authorId == authorId ){
            await Comment.findByIdAndUpdate(commentId,{content:content},{new:true})
            res.status(200).send("Comments updated successfully.")
        }
        else{
            res.status(400).send("You don't have access to edit this comment.")
        }
        
        
        
    } catch (error) {
        res.status(500).json('Failed to edit comments' );
    }
}

module.exports = {addComment,fetchComment,deleteComment,editComments}