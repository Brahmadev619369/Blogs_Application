const express = require("express");
const { connect } = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const ConnectToMongo = require("./config/connetion")
const upload = require("express-fileupload")
const commentRoutes = require("./routes/commentRoutes")
const contactRoutes = require("./routes/Contact")

const app = express();

// connect to DB
ConnectToMongo(process.env.MONGO_URL)

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.resolve("./public"))); // to serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Add cookie-parser and bodyparser middleware 
app.use(cookieParser());
app.use(bodyParser.json()); // To handle JSON bodies
app.use(cors({ credentials: true, origin: process.env.ORIGIN,methods:["GET","POST","PUT","DELETE","PATCH"] }));


// Routes
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/blogs/comments", commentRoutes);
app.use("/api/contact",contactRoutes)

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack
  res.status(500).send({ error: 'Something went wrong!' }); // Send a generic error response
  next()
});

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })
