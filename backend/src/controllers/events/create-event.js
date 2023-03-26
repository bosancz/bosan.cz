var fs = require("fs-extra");
var path = require("path");

var config = require("../../config");
var Event = require("../../models/event");

module.exports = async function(eventData,eventFiles = [],options = {}){
    
  var event = await Event.create(eventData);
  
  var eventDir = config.events.eventDir(String(event._id));
  
  await fs.mkdir(eventDir);
    
  for(var file of eventFiles){
    if(options.copyFiles) await fs.copy(file,path.join(eventDir,path.basename(file)));
    else await fs.move(file,path.join(eventDir,path.basename(file)),{overwrite:true});
  }
  
  return event;
}