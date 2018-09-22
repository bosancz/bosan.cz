var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
  "login": {type:String, index: { unique: true }},
  "email": {type:String, index: { unique: true, sparse: true}},
  "password": {type: String, select:false},
  
  "roles": [String],
  
  "member": {type: mongoose.Schema.Types.ObjectId, ref: "Member"}
});



var User = module.exports = mongoose.model("User", userSchema);

User.on('index', function(err) {
    if (err) {
        console.error('User index error: %s', err);
    } else {
        console.info('User indexing complete');
    }
});