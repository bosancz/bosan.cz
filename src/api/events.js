var express = require("express");
var router = module.exports = express.Router();

var acl = require("express-dynacl");

var Event = require("../models/event");

router.get("/", acl("events:list"), async (req,res,next) => {

  var options = {
    select: ["_id","name","dateFrom","dateTill","type","status"],
    page: req.query.page || 1,
    limit: req.query.limit ? Math.min(100,req.query.limit) : 20,
    populate: []
  };
  if(req.query.description) options.select.push("description");

  var where = {};
  if(req.query.status && req.query.status !== "all") where.status = req.query.status;
  if(!req.query.status || !await acl.can("albums:drafts:list",req)) where.status = "public";
  if(req.query.leader) where.leaders = req.query.leader;
  if(req.query.search) where.name = new RegExp(req.query.search,"i");
  if(req.query.noleader) where.$or = [{"leaders":{$size:0}},{"leaders": {$exists:false}}];
  if(req.query.dateFrom) where.dateTill = {$gte: new Date(req.query.dateFrom)};
  if(req.query.dateTill) where.dateFrom = {$lte: new Date(req.query.dateTill)};


  if(req.query.leaders) options.populate.push({path: "leaders", select: "_id name nickname group"});
  if(req.query.sort) options.sort = req.query.sort;
  
  res.json(await Event.paginate(where,options));
});

router.post("/", acl("events:create"), async (req,res,next) => {
  var event = await Event.create(req.body);
  res.status(201).json(event);
});            

/* SIGNLE EVENT */

// read the event document
router.get("/:event", acl("events:read"), async (req,res,next) => res.json(await Event.findOne({_id:req.params.event})));

// change part of the events
router.patch("/:event",  acl("events:update"), async (req,res,next) => {
  // update event in the database with new data
  await Event.findOneAndUpdate({_id:req.params.event},req.body);
  // return OK, no data
  res.sendStatus(204);
});


router.delete("/:event", acl("events:delete"), async (req,res,next) => {
  var event = await Event.findOne({_id:req.params.event}).select("recurring");
  
  // remove from recurring if is an recurring event
  if(event.recurring){
    var recurring = await EventRecurring({_id:event.recurring});
    recurring.instances = recurring.instances.filter(instance => instance._id !== req.params.event);
    await recurring.save();
  }
  
  // remove the event from database
  await Event.remove({_id:req.params.event})
  
  // return OK, no data
  res.sendStatus(204);
});

router.get("/:event/leaders", acl("events:leaders:list"), async (req,res,next) => {
  
  // get event with populated leaders' members
  var event = await Event.findOne({_id:req.params.event}).select("leaders").populate("leaders","_id nickname name group");

  // return just the leaders
  res.json(event.leaders || []);
});
