var fs = require("fs-extra");

var config = require("../../config");

var Event = require("../../models/event");

module.exports = async function(eventId){
  
  // delete the event's file data
  var eventDir = config.events.eventDir(eventId);
  await fs.remove(eventDir);

  // remove the event from database
  await Event.deleteOne({_id:eventId})

}