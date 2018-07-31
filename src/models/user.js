var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
  "_id": String,
  "password": {type: String, select:false},
  "roles": [String],
  
  "email": String,
  
  "member": {type: mongoose.Schema.Types.ObjectId, ref: "Member"}
});

module.exports = mongoose.model("User", userSchema);