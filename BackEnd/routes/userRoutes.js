// userRoutes.js
const { Router } = require("express");
const { registerUser, loginUser,getUser,getAuthor,changeProfile ,editUser,forgotPassword,resetPassword,activateUser,deleteUser} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware")
const upload = require('../config/multer');
const multer = require('multer');

const router = Router();

router.post("/register", registerUser);  //
router.post("/register/activation/:activateToken",activateUser)
router.post("/login", loginUser); //
router.get("/:id",getUser) 
router.get("/",getAuthor)  //
router.patch("/edit-user",authMiddleware,editUser) //
router.post("/forgot-password",forgotPassword) 
router.post("/reset-password/:resetToken",resetPassword)
router.delete("/admin/:id",authMiddleware,deleteUser)

router.post("/change-profile",authMiddleware,(req,res,next)=>{
    upload.single('profile')(req,res,(err)=>{
        if(err){
            if (err instanceof multer.MulterError){
                if (err.code === 'LIMIT_FILE_SIZE'){
                    return res.status(400).json({ error: "File size is too large. Max limit is 500KB." });
                }

                else if (err.message === 'Only images are allowed'){
                    return res.status(400).json({ error: "Unexpected file type." });
                }
                else{
                    return res.status(400).json({ error: err.message });
                }
            }
        }
        next()
    })
},changeProfile) //



module.exports = router;