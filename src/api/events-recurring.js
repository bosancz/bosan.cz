var express = require("express");
var router = module.exports = express.Router({mergeParams: true});
var mongoose = require('mongoose');

var acl = require("express-dynacl");

var Event = require("../models/event");
var EventRecurring = require("../models/event-recurring");

async function createInstancesByType(recurring,event){
  
  let eventData = event.toObject();
  eventData.recurring = recurring._id;
  
  let startDate = recurring.startDate;
  let endDate = recurring.endDate;
  
  startDate.setUTCHours(0,0,0,0);
  endDate.setUTCHours(0,0,0,0);
  eventData.dateFrom.setUTCHours(0,0,0,0);
  eventData.dateTill.setUTCHours(0,0,0,0);
  
  let date;
  
  switch(recurring.type){
    case "weekly":
      date = startDate;
      while(date.getDay() !== eventData.dateFrom.getDay()) date.setDate(date.getDate() + 1);
      // create the instances
      return createInstances(date,date => date.setDate(date.getDate() + 7),endDate,eventData); 

    case "monthly":
      date = new Date(startDate.getFullYear(), startDate.getMonth(), eventData.getDate());
      while(date < startDate) date.setMonth(date.getMonth() + 1);
      // create the instances
      return createInstances(date,date => date.setMonth(date.getMonth() + 1),endDate,eventData); 

    case "yearly":
      date = new Date(startDate.getFullYear(),eventData.dateFrom.getMonth(),eventData.dateFrom.getDate());
      while(date < startDate) date.setFullYear(date.getFullYear() + 1);
      // create the instances
      return createInstances(date,date => date.setFullYear(date.getFullYear() + 1),endDate,eventData); 

  }
}

async function createInstances(date,nextDate,endDate,eventData){
  var instances = [];

  var exceptTime = eventData.dateFrom.getTime();
  var exceptId = eventData._id;
  
  delete eventData._id;
  delete eventData.id;
  delete eventData.__v;
  
  var length = eventData.dateTill.getTime() - eventData.dateFrom.getTime();
  
  while(date <= endDate){
    
    if(date.getTime() === exceptTime){
      instances.push(exceptId);
      nextDate(date);
      continue;
    }
    
    eventData.dateFrom = date;
    eventData.dateTill = new Date(date.getTime() + length);

    let instance = await Event.create(eventData);
    instances.push(instance._id);

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

router.put("/", acl("events:edit"), async (req,res) => {
  // find the event to find recurring _id
  var event = await Event.findOne({"_id": req.params.event});
  if(!event) return res.status(404).send("Event not found");
  if(event.recurring) return res.status(400).send("Recurring already active.");

  let type = req.body.type;
  if(!type) return res.status(400).send("Type missing");

  let startDate = new Date(req.body.startDate);
  let endDate = new Date(req.body.endDate);
  if(!startDate || !endDate) return res.status(400).send("Bad date format");

  let recurringData = {
    _id: mongoose.Types.ObjectId(),
    type: type,
    startDate: startDate,
    endDate: endDate,
    events: []
  };

  // create instances of events by source event. source event is included in the list
  recurringData.events = await createInstancesByType(recurringData,event);
  
  // connect original event to recurring
  event.recurring = recurringData._id;
  await event.save();
  
  // create the parent recurring object
  await EventRecurring.create(recurringData);
  
  res.sendStatus(201);

});

router.delete("/", acl("events:edit"), async (req,res) => {

  var event = await Event.findOne({"_id": req.params.event}).select("_id recurring");
  if(!event) return res.status(404).send("Event not found");
  if(!event.recurring) return res.status(404).send("Event recurring not found.");

  var recurring = await EventRecurring.findOne({"_id": event.recurring});

  await Event.remove({recurring:event.recurring, _id: {$ne : event._id}});
  
  event.recurring = null;
  await event.save();

  await EventRecurring.remove({_id: recurring._id});
  
  res.sendStatus(204);

});



