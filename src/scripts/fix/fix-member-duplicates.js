var mongoose = require("mongoose");

var connection = require("../db");

var Event = require("../models/event");
var Member = require("../models/member");

async function fixMemberDuplicates(){
  
  var counter = 0;
  
  var members = await Member.find({"name.first": {$exists: true}}).select("_id nickname name");
  
  for(var member of members){
    var duplicate = await Member.findOne({_id: {$ne: member._id},nickname:member.nickname});
    
    if(!duplicate) continue;
    console.log("=================");
    console.log(duplicate.nickname,duplicate._id,member.nickname,member._id);
    
    var events = await Event.find({leaders:duplicate._id}).select("_id name leaders");    
    
    for(var event of events){
      let newLeaders = event.leaders.filter(leader => String(leader) !== String(duplicate._id));
      newLeaders.push(member._id);
      event.leaders = newLeaders;
      await event.save()
    }
    
    await Member.remove({_id:duplicate._id});
    
    counter ++;
    
  }
  console.log("======================");
  console.log("Fixed duplicates: " + counter);
}
  
  /* RUN, FOREST, RUN */
Promise.resolve()
  .then(() => connection)
  .then(() => fixMemberDuplicates())
  .then(() => mongoose.disconnect().then(() => console.log("DB disconnected")))
  .then(() => process.exit())
  .catch(err => {
    console.error("Error: " + err.name);
    console.error(err);
    process.exit(1);
  });