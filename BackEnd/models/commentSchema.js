const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    author :{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    blogId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Blog",
        require:true
    },
    authorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
})

const Comment = mongoose.model("Comment",CommentSchema)

module.exports = Comment;