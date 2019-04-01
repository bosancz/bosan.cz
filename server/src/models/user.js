var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
  "login": { type:String, index: { unique: true } },
  "password": { type: String, select:false },
  
  "email": {type:String, index: { unique: true, sparse: true}},
  
  "roles": [String],
  
  "loginCode": { type: String, index: { unique: true, sparse: true } },
  "loginCodeExp": String,
  
  "member": {type: mongoose.Schema.Types.ObjectId, ref: "Member"},
  
  "notifications": [String],
  
  "pushSubscriptions": [{ type: mongoose.Schema.Types.Mixed, select:false }]
  
},{toObject:{virtuals:true}});



var User = module.exports = mongoose.model("User", userSchema);

User.on('index', function(err) {
    if (err) {
        console.error('User index error: %s', err);
    } else {
        console.info('User indexing complete');
    }
});