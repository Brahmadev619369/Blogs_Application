const mongoose = require("mongoose")
const {randomBytes,createHmac} = require("crypto");
const { error } = require("console");
const {createTokenForUser} = require("../services/Auth");
const { type } = require("os");

const userSchema = new mongoose.Schema({
    fullName : {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true,
    },
    profileURL: {
        type:String,
        default:"Images/profile.png"
    },
    role: {
        type:String,
        enum:["User","Admin"],
        default:"User"
    },

    resetToken: {
        type:String
    },
    resetTokenExpiry:{
        type:Date
    },
    isActivated :{
        type:Boolean,
        default:false
    },
    activationToken:{
        type:String
    },
    activationTokenExpiry:{
        type:Date
    }
},{timestamps:true})




const User = mongoose.model("User",userSchema)

module.exports = User;