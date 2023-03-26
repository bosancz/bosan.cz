var mongoose = require("mongoose");

var connection = require("../db");

var User = require("../models/user");

async function fixUserId(){
  
  const users = await User.find({});
  
  for(let user of users){
    
    let userData= user.toObject();
    userData._id = userData._id.toLowerCase();
    
    console.log(`Converting ${user._id} to ${userData._id}.`);
    
    await User.deleteOne({_id:user._id});
    await User.create(userData);
  }
}

Promise.resolve()
  .then(() => connection)
  .then(() => fixUserId())
  .then(() => mongoose.disconnect())
  .then(() => process.exit());