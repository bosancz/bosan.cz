var express = require("express");
var router = module.exports = express.Router();

var acl = require("express-dynacl");

var validate = require("../validator");

var Event = require("../models/event");
var EventRecurring = require("../models/event-recurring");

var getEventsSchema = {
  type: 'object',
  properties: {
    "filter":{
      type: "object",
      properties: {
        "dateFrom": { anyOf: [
          { type: "string" }, 
          { type: "object", properties: {"$gte": {type: "string", format: "date"},"$lte": {type: "string", format: "date"}}, additionalProperties: false}
        ]},
        "leaders": { anyOf: [
          { type: "string" }, 
          { type: "array", items: { type: "string"}},
          { type: "object", properties: {"$size": {type: "number"}}, additionalProperties: false}
        ]},
        "type": { anyOf: [
          { type: "string" },
          { type: "object", properties: {"$ne": {type: "string"}}, additionalProperties: false}
        ]},
      },
      additionalProperties: false
    },
    "select": { type: "array", items: { type: "string" } },
    "populate": { type: "array", items: { enum: ["leaders"] } },
    "search": { type: "string" },
    "sort": { type: "string", enum: ["dateFrom","-dateFrom","name","-name"] },
    "page": { type: "number" },
    "limit": { type: "number" },
  },
  additionalProperties: false
};

router.get("/", validate({query:getEventsSchema}), acl("events:list"), async (req,res,next) => {

  var options = {
    select: req.query.select || ["_id","name","dateFrom","dateTill","type","status"],
    page: req.query.page || 1,
    limit: req.query.limit ? Math.min(100,req.query.limit) : 20,
    populate: req.query.populate || []
  };

  var where = req.query.filter || {};
  if(req.query.search) where.name = new RegExp(req.query.search,"i");

  if(!await acl.can("events:drafts:list",req)) where.status = "public";

  if(req.query.sort) options.sort = req.query.sort.replace(/(\-?)dateFrom/,"$1dateFrom $1order");

  res.json(await Event.paginate(where,options));
});

router.post("/", acl("events:create"), async (req,res,next) => {
  var event = await Event.create(req.body);
  res.status(201).json(event);
});     



var getEventsUpcomingSchema = {
  type: 'object',
  properties: {
    "limit":{ type: "number" },
    "days":{ type: "number" }
  }
};

router.get("/upcoming", validate({query:getEventsUpcomingSchema}), acl("events:upcoming:list"), async (req,res,next) => {

  let today = new Date(); today.setHours(0,0,0,0);

  var events = Event.find({status:"public",dateFrom: { $gte: today }});
  events.select("_id name dateFrom dateTill groups leadersEvent description type subtype meeting");
  events.populate("leaders","_id name nickname group contacts.mobile");
  events.sort("dateFrom order");  

  if(req.query.limit) events.limit(Number(req.query.limit));
  if(req.query.days){
    let dateTill = new Date(); dateTill.setDate(dateTill.getDate() + Number(req.query.days));
    events.where({dateFrom: { $lte: dateTill }});
  }

  res.json(await events);
});

/* SINGLE EVENT */

var getEventSchema = {
  type: 'object',
  properties: {
    "populate":{type: "array", items: { enum: ["leaders"] } },
  },
  additionalProperties: false
};

// read the event document
router.get("/:event", validate({query:getEventSchema}), acl("events:read"), async (req,res,next) => {
  let event = Event.findOne({_id:req.params.event});
  if(req.query.populate.leaders) event.populate("leaders","_id name nickname");
  res.json(await event);
});

// change part of the events
router.patch("/:event",  acl("events:edit"), async (req,res,next) => {
  // update event in the database with new data
  await Event.findOneAndUpdate({_id:req.params.event},req.body);
  // return OK, no data
  res.sendStatus(204);
});


router.delete("/:event", acl("events:delete"), async (req,res,next) => {
  var event = await Event.findOne({_id:req.params.event}).select("recurring");

  // remove from recurring if is an recurring event
  if(event.recurring){
    var recurring = await EventRecurring.findOne({_id:event.recurring});
    if(recurring.events.length === 1 && String(recurring.events[0]) === String(event._id)){
      await EventRecurring.remove({_id:event.recurring});
    }
    else{
      recurring.events = recurring.events.filter(instance => instance._id !== req.params.event);
      await recurring.save();
    }
  }

  // remove the event from database
  await Event.remove({_id:req.params.event})

  // return OK, no data
  res.sendStatus(204);
});

router.get("/:event/leaders", acl("events:read"), async (req,res,next) => {

  // get event with populated leaders' members
  var event = await Event.findOne({_id:req.params.event}).select("leaders").populate("leaders","_id nickname name group");

  // return just the leaders
  res.json(event.leaders || []);
});
