var mongoose = require("mongoose");

var groupSchema = mongoose.Schema({
  "_id": String,
  "name": String,
});

module.exports = mongoose.model("Group", groupSchema);