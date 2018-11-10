var express = require("express");
var router = module.exports = express.Router({mergeParams: true});

var config = require("../../config");

var acl = require("express-dynacl");
var fs = require("fs-extra");
var path = require("path");
var rmfr = require("rmfr");

var multer = require("multer");
var upload = multer({ dest: config.uploads.dir })

var validate = require("../validator");

var createEvent = require("./events/create-event");
var deleteEvent = require("./events/delete-event");

var Event = require("../models/event");

var getEventSchema = {
  type: 'object',
  properties: {
    "select": { type: "string" },
    "populate": { type: "array", items: { enum: ["leaders"] } },
  },
  additionalProperties: false
};

// read the event document
router.get("/", validate({query:getEventSchema}), acl("events:read"), async (req,res,next) => {
  
  const query = Event.findOne({_id:req.params.event});
  
  if(req.query.select) query.select(req.query.select);
  
  // TODO: fix
  if(req.query.populate && req.query.populate.leaders) query.populate("leaders","_id name nickname");
  
  const event = await query;
  
  res.json(await event);
});

// change part of the events
router.patch("/",  acl("events:edit"), async (req,res,next) => {
  // update event in the database with new data
  await Event.findOneAndUpdate({_id:req.params.event},req.body);
  // return OK, no data
  res.sendStatus(204);
});


router.delete("/", acl("events:delete"), async (req,res,next) => {
  await deleteEvent(req.params.event);

  // return OK, no data
  res.sendStatus(204);
});

router.get("/leaders", acl("events:read"), async (req,res,next) => {

  // get event with populated leaders' members
  var event = await Event.findOne({_id:req.params.event}).select("leaders").populate("leaders","_id nickname name group");

  // return just the leaders
  res.json(event.leaders || []);
});

router.post("/registration", upload.single("file"), acl("events:edit"), async (req,res,next) => {
  
  var event = await Event.findOne({_id:req.params.event});
  
  try{

    var file = req.file;
    if(!file) throw new Error("Missing file");

    var eventDir = path.join(config.events.storageDir,String(event._id));
    var originalPath = req.file.path;
    var storagePath = path.join(eventDir,"registration.pdf");

    await fs.ensureDir(eventDir);
    
    await fs.move(originalPath,storagePath);
  }
  catch(err){
    err.name = "UploadError";
    throw err;    
  }
  
  event.registration = "registration.pdf";
  await event.save()
  
  res.sendStatus(204);
});

router.delete("/registration", acl("events:edit"), async (req,res,next) => {
  var event = await Event.findOne({_id:req.params.event});
  
  if(!event.registration) return res.sendStatus(404);
  
  var registrationFile = path.join(config.events.storageDir,String(event._id),event.registration);
  await rmfr(registrationFile);
  
  event.registration = null;
  await event.save();
  
  res.sendStatus(204);
});

router.post("/actions/:action", async (req,res,next) => {
  
  if(!await acl.can("events:" + req.params.action,req)) return res.sendStatus(401);
  
  var event = await Event.findOne({_id:req.params.event});
  
  await event.action(req.params.action);
  
  await event.save();
  
  res.sendStatus(200);
});