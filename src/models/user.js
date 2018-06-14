var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
  "_id": String,
  "password": {type: String, select:false},
  "roles": [String]
});

module.exports = mongoose.model("User", userSchema);