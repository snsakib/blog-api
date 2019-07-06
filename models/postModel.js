const mongoose = require("mongoose");

const { Schema } = mongoose;

const postModel = new Schema({
  title: String,
  publishedDate: Date,
  updateDate: Date,
  timeToRead: Number,
  content: String,
  author: String,
  categories: [String]
});

module.exports = mongoose.model('Post', postModel);
