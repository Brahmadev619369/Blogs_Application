const User = require("../models/userSchema");
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")
const fs = require("fs")
const path = require("path")
const { v4: uuid } = require("uuid");
const { use } = require("../routes/userRoutes");
const mongoose = require("mongoose");
const crypto = require("crypto")
const nodemailer = require("nodemailer");

const validatePassword = (password) => {
    const minLength = 8;
    const hasNumber = /\d/;
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) {
        return `Password must be at least ${minLength} characters long.`;
    }
    if (!hasNumber.test(password)) {
        return "Password must contain at least one number.";
    }
    if (!hasUpperCase.test(password)) {
        return "Password must contain at least one uppercase letter.";
    }
    if (!hasLowerCase.test(password)) {
        return "Password must contain at least one lowercase letter.";
    }
    if (!hasSpecialChar.test(password)) {
        return "Password must contain at least one special character.";
    }
    return null;
};

// POST: api/users/register
const registerUser = async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).send({ error: "All fields are required" });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
        return res.status(400).send({ error: passwordError });
    }


    try {
        const newemail = email.toLowerCase();
        console.log("Checking if email exists...");
        const emailExists = await User.findOne({ email: newemail });

        if (emailExists) {
            return res.status(400).send({ error: "Email already exists." });
        }


        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password, salt)
        const activationToken = crypto.randomBytes(32).toString("hex")

        const newUser = await User.create({
            fullName,
            email: newemail,
            password: hashedPass,
            activationToken: activationToken,
            activationTokenExpiry: Date.now() + 24*60*60*1000
        })

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        const mailOptions = {
            from: '"Blog Ki Duniya.." <raibrahmadev508@gmail.com>',
            to: email,
            subject: "Account Activation",
            html: `
        <b>Dear ${fullName},</b> <br> 
        <p>Please activate your account by clicking the following link:
        <a href="http://localhost:5173/users/register/activation/${activationToken}">Activate Account</a>.</p> 
        <br> 
        <p>If you didn't register this, please ignore this email.</p>
    `
        }

        transporter.sendMail(mailOptions, async (err, info) => {
            if (err) {
                await User.deleteOne({ _id: newUser._id });  // Rollback user creation if email fails
                return res.status(500).send({ error: "Failed to send activation email. Please try again." });
            }

            res.status(200).send("Activation link sent to your email.");
        });

    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).send({ error: error.message });
    }
};



// activate acc
const activateUser = async (req, res) => {
    const activateToken = req.params.activateToken
    try {
        console.log("activateToken", activateToken);

        const user = await User.findOne({
            activationToken: activateToken,
            activationTokenExpiry: { $gt: Date.now() }
        })

        console.log("user",user);
        

        if (!user) {
            const expiredUserToken = await User.findOne({ activationToken:activateToken })
            console.log(expiredUserToken);
            
            if (expiredUserToken) {
                await User.deleteOne({ _id: expiredUserToken._id })
                return res.status(400).send("Token expired. User has been deleted.");
            }

        }

        // update isActivate to true
        user.isActivated = true;
        user.activationToken = null;
        user.activationTokenExpiry = null;
        await user.save()

        res.status(200).send("Your account has been successfully activated.")

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}



// POST: api/users/login
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ error: "All fields are required" });
    }

    try {
        const newemail = email.toLowerCase();
        const user = await User.findOne({ email: newemail });


        if (!user) {
            return res.status(400).send({ error: "Invalid Credentials..." });
        }

        const comparePass = await bcrypt.compare(password, user.password);
        if (!comparePass) {
            return res.status(400).send({ error: "Invalid Credentials..." });
        }

        if (user.isActivated == false) {
            return res.status(400).send({ error: "Please Activate your account." });
        }

        console.log("hey user :", user)

        const { _id: id, fullName,role } = user;

        const token = JWT.sign({ id, fullName ,role }, process.env.SECRETKEY, { expiresIn: "1h" });
        res.status(200).json({ token, id, fullName });
        console.log(token);

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};


// GET: api/user/:id
const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid User ID format' });
        }
        const _userID = new mongoose.Types.ObjectId(id);

        const user = await User.findById(_userID).select("-password") // without password
        if (!user) {
            return res.status(400).send({ error: "user not found" });
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).send({ error: error.message });
    }

}


// GET: api/user/
const getAuthor = async (req, res, next) => {
    try {
        const user = await User.find().select("-password") // without password
        if (!user) {
            return res.status(400).send({ error: "user not found" });
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}


// POST: api/user/change-profile
const changeProfile = async (req, res) => {
    try {
        const profile = req.file;


        if (!profile) {
            return res.status(400).send({ error: "Please choose an image" });
        }

        const id = req.user.id; // Assuming authmiddleware sets req.user
        const user = await User.findById(id);

        // Remove old profile if it's not the default image
        if (user.profileURL && user.profileURL !== 'Images/profile.png') {
            fs.unlink(path.join(__dirname, '..', 'public', user.profileURL), (err) => {
                if (err) {
                    console.error(err);
                }
            });
        }

        // Update in DB
        const updateProfile = await User.findByIdAndUpdate(id, { profileURL: `Images/${profile.filename}` }, { new: true });

        if (!updateProfile) {
            return res.statu(400).send({ error: "Profile couldn't be changed" });
        }

        res.status(200).json(updateProfile);
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).send({ error: error.message });
    }
};


const editUser = async (req, res, next) => {
    try {
        const { email, fullName, currentPassword, newPassword, newConfirmPassword } = req.body;

        const userID = req.user.id;
        const user = await User.findById(userID);
        const emailExists = await User.findOne({ email: email });

        if (emailExists && emailExists._id != userID) {
            return res.status(400).send({ error: "Email already exists!" });
        }

        const validatePassword = await bcrypt.compare(currentPassword, user.password);
        if (!validatePassword) {
            return res.status(401).send({ error: "Invalid current password" });
        }

        const updateData = {
            email: email,
            fullName: fullName,
        };

        // Only update the password if a new password is provided
        if (newPassword && newConfirmPassword) {
            if (newPassword !== newConfirmPassword) {
                return res.status(400).send({ error: "Passwords do not match" });
            }

            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(newPassword, salt);
        }

        const updateUser = await User.findByIdAndUpdate(userID, updateData, { new: true }).select("-password");

        if (!updateUser) {
            return res.status(500).send({ error: "User not updated. Please try again." });
        }

        res.status(200).json(updateUser);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};


const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json("Email is required")
    }

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json("User Not Found")
        }
        // gen token
        const resetToken = crypto.randomBytes(30).toString("hex");
        // save these token to db 
        user.resetToken = resetToken
        user.resetTokenExpiry = Date.now() + 3600000
        // 1hr for exp

        await user.save()

        //setup mail transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        const mailOptions = {
            to: user.email,
            subject: "Password Reset",
            // text: `You requested a password reset. Click the link to reset your password: http://localhost:5173/reset-password/${resetToken} If you not just ignore it.`
            html: `
        <b>Dear ${user.fullName},</b> <br> 
        <p>You requested a password reset. Click the link to reset your password: 
        <a href="http://localhost:5173/users/reset-password/${resetToken}">Reset Password</a>.</p> 
        <br> 
        <p>If you didn't request this, please ignore this email.</p>
    `
        }
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                return res.status(500).send("Error to sending email.")
            }

            res.status(200).send("Password reset link sent to your email.")
        })

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}


const resetPassword = async (req, res) => {
    const resetToken = req.params.resetToken
    const { password, confirmPassword } = req.body;
    // const resetToken = decodeURIComponent(req.params.resetToken);
    // console.log("Decoded resetToken:", resetToken);


    if (!password || !confirmPassword) {
        return res.status(400).send("Password and confirm password are required.");
    }
    if (password !== confirmPassword) {
        return res.status(400).send("Passwords do not match.");

    }



    //password validation
    const minLength = 8;
    const hasNumber = /\d/;
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) {
        return res.status(400).send(`Password must be at least ${minLength} characters long.`);
    }
    if (!hasNumber.test(password)) {
        return res.status(400).send("Password must contain at least one number.");
    }
    if (!hasUpperCase.test(password)) {
        return res.status(400).send("Password must contain at least one uppercase letter.");
    }
    if (!hasLowerCase.test(password)) {
        return res.status(400).send("Password must contain at least one lowercase letter.");
    }
    if (!hasSpecialChar.test(password)) {
        return res.status(400).send("Password must contain at least one special character.")
    }




    try {
        // Check if the token is valid and not expired
        const user = await User.findOne({
            resetToken: resetToken,
            resetTokenExpiry: { $gt: Date.now() }
        });

        // If user is not found or token is invalid/expired
        if (!user) {
            return res.status(400).send("Invalid or expired token.");
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt);

        // Update user's password and clear the reset token fields
        user.password = hashPass;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        await user.save();

        res.status(200).send("Password reset successful.");
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// delete users
const deleteUser = async (req, res) => {
    const { id } = req.params; 

    try {
        const user = await User.findById(id);  
        if (!user) {
            return res.status(400).send("User not found."); 
        }

        // check if admin is there or not
        if(req.user?.role === "Admin"){
        // Check if user has a custom profile picture that needs to be deleted
        if (user.profileURL && user.profileURL !== "Images/profile.png") {
            fs.unlink(path.join(__dirname, "..", "public", user.profileURL), async (err) => {
                if (err) {
                    console.error("Error deleting profile picture:", err);
                }

                await User.findByIdAndDelete(id);  // Delete the user after handling the file
                return res.status(200).send("User has been successfully deleted.");  // Return the success response
            });
        } else {
            // If no custom profile picture, just delete the user
            await User.findByIdAndDelete(id);
            return res.status(200).send("User has been successfully deleted.");
        }
        }else{
            return res.status(400).send("Only admin can access."); 
        }


    } catch (error) {
        return res.status(500).send({ error: error.message });  // Ensure a response is always sent
    }
};

module.exports = { registerUser, loginUser, getUser, getAuthor, changeProfile, editUser, forgotPassword, resetPassword, activateUser ,deleteUser };
