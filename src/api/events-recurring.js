var express = require("express");
var router = module.exports = express.Router({mergeParams: true});

var mongoose = require('mongoose');
var path = require("path");
var acl = require("express-dynacl");

var createEvent = require("./events/create-event");
var deleteEvent = require("./events/delete-event");

var config = require("../../config");

var Event = require("../models/event");
var EventRecurring = require("../models/event-recurring");

async function createRecurring(recurring,event){
  
  // list event files to copy
  var eventFiles = [];
  if(event.registration) eventFiles.push(path.join(config.events.eventDir(String(event._id)),event.registration));
  
  // normalize DB data
  var eventData = event.toObject();
  eventData.recurring = recurring._id;
  eventData.dateFrom.setUTCHours(0,0,0,0);
  eventData.dateTill.setUTCHours(0,0,0,0);
  delete eventData._id;
  delete eventData.id;
  delete eventData.__v;

  let startDate = recurring.startDate;
  let endDate = recurring.endDate;
  startDate.setUTCHours(0,0,0,0);
  endDate.setUTCHours(0,0,0,0);
  
  let date;
  
  switch(recurring.type){
    case "weekly":
      date = startDate;
      while(date.getDay() !== eventData.dateFrom.getDay()) date.setDate(date.getDate() + 1);
      
      // create the instances
      return createInstances(date,date => date.setDate(date.getDate() + 7),endDate,eventData,eventFiles); 

    case "monthly":
      date = new Date(startDate.getFullYear(), startDate.getMonth(), eventData.getDate());
      while(date < startDate) date.setMonth(date.getMonth() + 1);// move past the start date
      
      // create the instances
      return createInstances(date,date => date.setMonth(date.getMonth() + 1),endDate,eventData,eventFiles); 
      
    case "monthlyDay":
      let nth = Math.ceil(event.dateFrom.getDate() / 7);
      let day = event.dateFrom.getDay();
      
      date = new Date(startDate.getFullYear(),startDate.getMonth(),(nth - 1) * 7 + 1);
      while(date < startDate) date.setMonth(date.getMonth() + 1);// move past the start date
      date.setDate(date.getDate() + (day + 7 - date.getDay()) % 7); // move to the same weekday
      
      // create the instances
      return createInstances(date,date => {
        date.setMonth(date.getMonth() + 1)
        date.setDate((nth - 1) * 7 + 1);
        date.setDate(date.getDate() + (day + 7 - date.getDay()) % 7);
      },endDate,eventData,eventFiles); 

    case "yearly":
      date = new Date(startDate.getFullYear(),eventData.dateFrom.getMonth(),eventData.dateFrom.getDate());
      while(date < startDate) date.setFullYear(date.getFullYear() + 1);// move past the start date
      
      // create the instances
      return createInstances(date,date => date.setFullYear(date.getFullYear() + 1),endDate,eventData,eventFiles); 

  }
}

async function createInstances(date,nextDate,endDate,eventData,eventFiles){
  
  var instances = [];
  
  var length = eventData.dateTill.getTime() - eventData.dateFrom.getTime();
  
  var sourceEventTime = eventData.dateFrom.getTime();
  
  while(date <= endDate){
    
    // skip source event date
    if(date.getTime() === sourceEventTime){
      nextDate(date);
      continue;
    }
    
    eventData.dateFrom = date;
    eventData.dateTill = new Date(date.getTime() + length);
    
    let instance = await createEvent(eventData,eventFiles,{copyFiles:true});
    instances.push({_id: instance._id, date: new Date(date)});

    nextDate(date);
  } 
  
  return instances;

} 


router.get("/", acl("events:read"), async (req,res) => {
  // find the event to find recurring _id
  var event = await Event.findOne({"_id": req.params.event}).select("_id recurring");
  if(!event) return res.status(404).send("Event not found");
  if(!event.recurring) return res.status(404).send("Event recurring not found.");

  // find recurring
  var recurring = EventRecurring.findOne({_id:event.recurring});

  if(req.query.events) recurring.populate("events","_id name dateFrom dateTill");

  res.json(await recurring);
});

router.put("/", acl("events:edit"), async (req,res,next) => {
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

router.delete("/", acl("events:edit"), async (req,res) => {

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



