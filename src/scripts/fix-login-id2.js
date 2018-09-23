var mongoose = require("mongoose");

var connection = require("../db");

var User = require("../models/user");

async function fixUserId(){
  
  const users = await User.find({}).select("+password");
  
  for(let user of users){
    
    user.login = user._id;
    await user.save()

    /*
    let userData = user.toObject();
    userData._id = mongoose.Types.ObjectId();
    userData.login = user._id;  
    
    console.log(`Converting ${user._id} to ${userData._id}.`);
    
    await User.deleteOne({_id:user._id});
    await User.create(userData);*/
  }
}

Promise.resolve()
  .then(() => connection)
  .then(() => fixUserId())
  .then(() => mongoose.disconnect())
  .then(() => process.exit());