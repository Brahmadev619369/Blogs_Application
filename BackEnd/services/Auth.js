// const JWT = require("jsonwebtoken")

// const secretKey = 

// function createTokenForUser(user){
//     const payload = {
//         __id:user._id,
//         fullName:user.fullName,
//         email:user.email,
//         profileURL:user.profileURL
//     }

//     const token = JWT.sign(payload,secretKey,{expiresIn:"1h"})
//     return token
// }


// // this function use in middleware
// function verifyJWT(token){
//     try{
//         const payload = JWT.verify(token,secretKey)
//         return payload
//     }
//     catch(err){
//         console.log("JWT verification failed",err.message);
//         return null
//     }
// }

// module.exports = {createTokenForUser,verifyJWT}