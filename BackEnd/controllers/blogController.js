const fs = require("fs")
const path = require("path")
const { v4: uuid } = require("uuid");
const User = require("../models/userSchema");
const Blog = require("../models/blogSchema");
const { param } = require("../routes/userRoutes");
const mongoose = require("mongoose");

// POST: api/blogs
const addBlog = async (req, res, next) => {
    try {
        const { title, category, description } = req.body
        const coverImg = req.file
        if (!title || !category || !description) {
            return res.status(400).send({ error: "All fields are required" });
        }

        if (!coverImg) {
            return res.status(400).send({ error: "Please choose an CoverImg" });
        }
        const blog = await Blog.create({
            title,
            category,
            description,
            creator: req.user.id,
            coverImgUrl: `CoverImg/${coverImg.filename}`
        })
        res.status(200).json(blog);
        // console.log(req.user);

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}


// GET: api/blogs
const Blogs = async (req, res, next) => {
    try {
        const blogs = await Blog.find({}).populate("creator").sort({"createdAt":-1})
        res.status(200).json(blogs)
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

// GET: api/blogs/:id
const blogDetails = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate the ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid blog ID format' });
        }


        // Find the blog by ID
        const blog = await Blog.findById(id).sort({ createAt: -1 }).populate("creator");

        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        res.status(200).json(blog);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};


// GET: api/blogs/categories/:category
const category = async (req, res, next) => {
    try {
        const { category } = req.params;
        catBlog = await Blog.find({ category: category }).sort({ createAt: -1 }).populate("creator").sort({"createdAt":-1})
        res.status(200).json(catBlog);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

// GET: api/blogs/users/:id
const blogAuthor = async (req, res, next) => {
    try {
        const { id } = req.params
        const blogs = await Blog.find({ creator: id }).sort({ createAt: -1 }).populate("creator").sort({"createdAt":-1})
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

// GET: api/blogs/myblogs
const myBlogs = async (req, res, next) => {
    try {

        const userID = await req.user.id
        if (!mongoose.Types.ObjectId.isValid(userID)) {
            return res.status(400).json({ error: 'Invalid blog ID format' });
        }
        const _userID = new mongoose.Types.ObjectId(userID);
        const myblogs = await Blog.find({ creator: _userID }).sort({"createdAt":-1})
        res.status(200).json(myblogs)
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}


// patch: api/blogs/:id
const editBlog = async (req, res, next) => {

    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid blog ID format' });
        }
        const _id = new mongoose.Types.ObjectId(id);

        const { title, category, description } = req.body
        if (!title || !category || !description) {
            return res.status(400).send({ error: "All fields are required" });
        }
        console.log(title);

        const coverImg = req.file

        if (!coverImg) {
            updateBlog = await Blog.findByIdAndUpdate(_id, { title, category, description }, { new: true })
            return res.status(200).json(updateBlog);
        }
        else {
            // delete old coverImg
            oldBlog = await Blog.findById({ _id })
            fs.unlink(path.join(__dirname, "..", "public", oldBlog.coverImgUrl), async (err) => {
                if (err) {
                    console.error(err);
                }
            })

            // upload new coverImg and update
            updateBlog = await Blog.findByIdAndUpdate(_id,
                {
                    title,
                    category,
                    description,
                    coverImgUrl: `CoverImg/${coverImg.filename}`
                },
                { new: true }
            )

            return res.status(200).json(updateBlog);

        }

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

// users can delete their blogs
// delete: api/blogs/:id
const deleteBlog = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid blog ID format' });
        }
        const _id = new mongoose.Types.ObjectId(id);
        const blog = await Blog.findById({ _id })

        if (req.user.id == blog.creator) { // delete coverImg
            fs.unlink(path.join(__dirname, "..", "public", blog.coverImgUrl), async (err) => {
                if (err) {
                    console.error(err);
                }
            })
            //delete blog details
            await Blog.findByIdAndDelete({ _id })
            return res.json(`Blog deleted successfully...`);
        }

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}


// admin delete blogs 
const adminDeleteBlogs = async(req,res) =>{
    const { id } = req.params;
    console.log("admin blog id ",id);
    console.log("checking role",req.user.role);
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid blog ID format' });
        }
        const _id = new mongoose.Types.ObjectId(id);
        const blog = await Blog.findById({ _id })
        console.log(blog);
        
       
        

        if(req.user.role === "Admin"){
            fs.unlink(path.join(__dirname, "..", "public", blog.coverImgUrl), async (err) => {
                if (err) {
                    console.error(err);
                }
            })
            //delete blog details
            await Blog.findByIdAndDelete({ _id })
            return res.json(`Blog deleted successfully...`);
        }else{
            return res.status(400).send("You have no permission to delete blogs.")
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
    
}

module.exports = { addBlog, Blogs, blogDetails, category, blogAuthor, myBlogs, editBlog, deleteBlog ,adminDeleteBlogs}