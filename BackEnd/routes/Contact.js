const { Router } = require("express");
const router = Router();
const nodemailer = require('nodemailer');

router.post("/", async (req, res) => {
    const { email, fullName, message } = req.body;

    if (!email || !fullName || !message) {
        res.status(400).send("All fields are required.")
    }
    
    try {
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        const mailOpt = {
            from: email,
            to: process.env.EMAIL_USER,
            subject: `New message from ${fullName}`,
            html:`You have messege from,
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Messages:</strong> ${message}</p>`
        }

        await transporter.sendMail(mailOpt,(err,info)=>{
            if(err){
                return res.status(500).send('Error sending email');
            }
            res.status(200).send('Message received');
        })
    } catch (error) {
        res.status(500).json({ error: 'Failed to send data' });
    }
}
)

module.exports = router;