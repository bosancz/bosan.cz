var fs = require("fs-extra");
var path = require("path");
var rmfr = require("rmfr");

var config = require("../../../config");

var Event = require("../../models/event");
var EventRecurring = require("../../models/event-recurring");

module.exports = async function(eventId){
  
  var event = await Event.findOne({_id:eventId}).select("recurring");

  // remove from recurring if is an recurring event
  if(event.recurring){
    var recurring = await EventRecurring.findOne({_id:event.recurring});
    if(recurring.events.length === 1 && String(recurring.events[0]) === String(event._id)){
      await EventRecurring.deleteOne({_id:event.recurring});
    }
    else{
      recurring.events = recurring.events.filter(instance => instance._id !== eventId);
      await recurring.save();
    }
  }
   
  // delete the event's file data
  var eventDir = config.events.eventDir(eventId);
  await rmfr(eventDir);

  // remove the event from database
  await Event.deleteOne({_id:eventId})

}