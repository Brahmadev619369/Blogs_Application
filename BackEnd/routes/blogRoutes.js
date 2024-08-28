const { Router } = require("express");
const authMiddleware = require("../middlewares/authMiddleware")
const {addBlog,Blogs,blogDetails,category,blogAuthor,myBlogs,editBlog,deleteBlog,adminDeleteBlogs} = require("../controllers/blogController")
const upload = require("../config/multerCover")
const router = Router();

router.post("/",upload.single('coverImg'),authMiddleware,addBlog) //
router.get("/",Blogs) //
router.get("/:id",blogDetails) //
router.get("/categories/:category",category)
router.get("/users/:id",blogAuthor) 
router.get("/myblogs/blogs",authMiddleware,myBlogs)  //
router.patch("/:id",authMiddleware,upload.single('coverImg'),editBlog) //
router.delete("/:id",authMiddleware,deleteBlog)  //
router.delete("/admin/:id",authMiddleware,adminDeleteBlogs)  //


module.exports = router;