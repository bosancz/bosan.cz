var mongoose = require("mongoose");

require("./group");

var memberSchema = mongoose.Schema({
  
  "nickname": String,
  
  "name": {
    "first": String,
    "last": String
  },
  
  "group": {type: String, ref: "Group"},
  
  
  "email": String,
  "mobile": String
});

module.exports = mongoose.model("Member", memberSchema);