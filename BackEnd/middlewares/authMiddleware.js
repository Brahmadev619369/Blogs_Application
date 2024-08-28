const JWT = require("jsonwebtoken");
const User = require("../models/userSchema");

const authMiddleware = async (req,res,next) =>{
    const Authorization = req.headers.Authorization || req.headers.authorization;
    if(Authorization && Authorization.startsWith("Bearer")){
        const token = Authorization.split(" ")[1]
        JWT.verify(token,process.env.SECRETKEY,(err,info)=>{
            if(err){
                return res.status(400).send({ error: "Unauthorized: no token"});
            }
            req.user = info
            next()
        })
    }else{
        return res.status(400).send({ error: "Unauthorized: no token"});
    }
}


module.exports = authMiddleware