const { Routes } = require("@smallhillcz/routesjs");

const config = require("../../config");

const routes = module.exports = new Routes();

var mongoose = require('mongoose');
var path = require("path");

var createEvent = require("./events/create-event");
var deleteEvent = require("./events/delete-event");
var createRecurring = require("./events/create-recurring.js");

var Event = require("../models/event");
var EventRecurring = require("../models/event-recurring");

routes.get("event:recurring","/",{permission:"events:read"}).handle(async (req,res) => {
  // find the event to find recurring _id
  var event = await Event.findOne({"_id": req.params.event}).select("_id recurring");
  if(!event) return res.status(404).send("Event not found");
  if(!event.recurring) return res.status(404).send("Event recurring not found.");

  // find recurring
  var recurring = EventRecurring.findOne({_id:event.recurring});

  if(req.query.events) recurring.populate("events","_id name dateFrom dateTill");

  res.json(await recurring);
});

routes.put("event:recurring","/",{permission:"events:edit"}).handle(async (req,res,next) => {
  // find the event to find recurring _id
  var event = await Event.findOne({"_id": req.params.event});
  if(!event) return res.status(404).send("Event not found");
  if(event.recurring) return res.status(400).send("Recurring already active.");

  let type = req.body.type;
  if(!type) return res.status(400).send("Type missing");

  let startDate = new Date(req.body.startDate);
  let endDate = new Date(req.body.endDate);
  if(!startDate || !endDate) return res.status(400).send("Bad date format");

  let recurringId = mongoose.Types.ObjectId();
  
  let recurringData = {
    _id: recurringId,
    type: type,
    startDate: startDate,
    endDate: endDate,
    events: []
  };
 
  try{
    // connect original event to recurring. if something fails, we have id to delete mess
    event.recurring = recurringId;
    await event.save();

    // create instances of events by source event. source event is included in the list
    var instances = await createRecurring(recurringData,event);
    instances.push({_id:event._id,date:new Date(event.dateFrom)});
    instances.sort((a,b) => a.date.getTime() - b.date.getTime());

    // create the parent recurring object
    recurringData.events = instances.map(instance => instance._id);
    await EventRecurring.create(recurringData);
    
    res.sendStatus(201);
  }
  catch(err){
    // delete all possible orphans
    await Event.remove({recurring:recurringId, _id: {$ne : event._id}});
    await EventRecurring.remove({_id: event.recurring});
    event.recurring = null
    await event.save();
    // propagate error
    next(err);
  }
  

});

routes.delete("event:recurring","/",{permission:"events:delete"}).handle(async (req,res) => {

  var event = await Event.findOne({"_id": req.params.event}).select("_id recurring");
  if(!event) return res.status(404).send("Event not found");
  if(!event.recurring) return res.status(404).send("Event recurring not found.");

  // delete instances except current
  var events = await Event.find({recurring:event.recurring, _id: {$ne : event._id}});
  
  for(var item of events) await deleteEvent(item.id);
  
  // delete recurring container
  await EventRecurring.deleteOne({_id: event.recurring});
  
  //updte current event
  event.recurring = null;
  await event.save();

  res.sendStatus(204);

});



