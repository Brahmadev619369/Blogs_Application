const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: [
            "Web Development",
            "Data Science",
            "Agriculture",
            "Education",
            "Entertainment",
            "Art",
            "Uncategorized",
        ],
        message: "value is not supported",
    },
    description: {  // Corrected typo here
        type: String,
        required: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    coverImgUrl: {
        type: String,
        required:true
    },
}, { timestamps: true });

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
