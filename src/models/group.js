const mongoose = require("mongoose");

const groupSchema = mongoose.Schema({
  "_id": String,
  "name": String,
  "color": String
}, { toJSON: { virtuals: true } });

module.exports = mongoose.model("Group", groupSchema);