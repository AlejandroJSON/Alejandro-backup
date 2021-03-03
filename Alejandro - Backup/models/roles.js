const mongoose = require("mongoose");

const project = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  rolid: String,
  name: String,
  color: String,
  members: Array,
  permissions: Number,
  position: Number,
  hoisted: Boolean
});

module.exports = mongoose.model("project", project);