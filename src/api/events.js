var express = require("express");
var router = module.exports = express.Router();

var config = require("../../config");

var acl = require("express-dynacl");
var mv = require("mv");
var fs = require("fs-extra");
var path = require("path");

var multer = require("multer");
var upload = multer({ dest: config.uploads.dir })

var validate = require("../validator");

var createEvent = require("./events/create-event");
var deleteEvent = require("./events/delete-event");

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
        "recurring": { anyOf: [
          { type: "null" },
          { type: "string" },
          { type: "object", properties: {"$ne": { anyOf: [{type:"string"},{type:"null"}]}}, additionalProperties: false}
        ]}
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
  
  var event = await createEvent(req.body);
  
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
  events.select("_id name dateFrom dateTill groups leadersEvent description type subtype meeting registration");
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
  await deleteEvent(req.params.event);

  // return OK, no data
  res.sendStatus(204);
});

router.get("/:event/leaders", acl("events:read"), async (req,res,next) => {

  // get event with populated leaders' members
  var event = await Event.findOne({_id:req.params.event}).select("leaders").populate("leaders","_id nickname name group");

  // return just the leaders
  res.json(event.leaders || []);
});

router.post("/:event/registration", upload.single("file"), acl("events:edit"), async (req,res,next) => {
  
  var event = await Event.findOne({_id:req.params.event});
  
  var file = req.file;
  var eventDir = path.join(config.events.storageDir,String(event._id));
  var originalPath = req.file.path;
  var storagePath = path.join(eventDir,"registration.pdf");
  
  await new Promise((resolve,reject) => fs.mkdir(eventDir,err => err && err.code !== "EEXIST" ? reject(err) : resolve()));
    
  await new Promise((resolve,reject) => mv(originalPath,storagePath,err => err ? reject(err) : resolve()));   
  
  event.registration = "registration.pdf";
  await event.save()
  
  res.sendStatus(204);
});

router.delete("/:event/registration", acl("events:edit"), async (req,res,next) => {
  var event = await Event.findOne({_id:req.params.event});
  
  if(!event.registration) return res.sendStatus(404);
  
  var registrationFile = path.join(config.events.storageDir,String(event._id),event.registration);
  await rmfr(registrationFile);
  
  event.registration = null;
  await event.save();
  
  res.sendStatus(204);
});