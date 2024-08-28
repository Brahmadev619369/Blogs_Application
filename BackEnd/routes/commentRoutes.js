const { Router } = require("express");
const authMiddleware = require("../middlewares/authMiddleware")
const router = Router();
const {addComment,fetchComment,deleteComment,editComments} = require("../controllers/commentController")

router.post("/:blogId",authMiddleware,addComment)

router.get("/:blogId",fetchComment)

router.delete("/:CommentId",authMiddleware,deleteComment)

router.patch("/:CommentId",authMiddleware,editComments)

module.exports = router;