// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Post = require("./models/postModel");
const path = require("path");
const postsRouter = require("./routes/postsRouter")(Post);

// Use express by initializing it & holding the reference in a constant named 'app'
const app = express();

// Connect to the MongoDB database
const db = mongoose
  .connect(
    `${process.env.MONGODB_URL}`, { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Connected to database.");
  })
  .catch(() => {
    console.log("Connection failed.");
  });

// Getting the port number from environment variable & saving it in a constant named 'port'
const port = process.env.PORT;

// Configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuring CORS header
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Configuring all the API routes such that all routes url must start with '/api' 
app.use("/api", postsRouter);

// Telling express to use the 'css' & 'js' files from the 'public' directory as static files
app.use(express.static(path.join(__dirname, 'public')));

// Showing a message on the browser screen, so that we can make sure of that the server has started properly
app.get("/", (req, res) => {
  res.redirect('https://snsakib-admin-panel.netlify.com');
});

// Listening to the port
app.listen(port, () => {
  console.log(`Running on port: ${port}`);
});
