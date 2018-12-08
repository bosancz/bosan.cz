const config = require("../../config");

const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

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
routes.get("event","/",{permission:"events:read"}).handle(validate({query:getEventSchema}), async (req,res,next) => {
  const query = Event.findOne({_id:req.params.id});
  
  if(req.query.select) query.select(req.query.select);
  
  // TODO: fix
  if(req.query.populate && req.query.populate.leaders) query.populate("leaders","_id name nickname");
  
  const event = await query;
  
  res.json(await event);
});

// change part of the events
routes.patch("event","/",{permission:"events:edit"}).handle(async (req,res,next) => {
  // update event in the database with new data
  await Event.findOneAndUpdate({_id:req.params.id},req.body);
  // return OK, no data
  res.sendStatus(204);
});


routes.delete("event","/",{permission:"events:delete"}).handle(async (req,res,next) => {
  await deleteEvent(req.params.id);

  // return OK, no data
  res.sendStatus(204);
});

routes.get("event:leaders","/leaders",{permission:"events:read"}).handle(async (req,res,next) => {

  // get event with populated leaders' members
  var event = await Event.findOne({_id:req.params.id}).select("leaders").populate("leaders","_id nickname name group");

  // return just the leaders
  res.json(event.leaders || []);
});

routes.get("event:registration","/registration",{permission:"events:registration:read"}).handle(async (req,res,next) => {
  res.sendFile(path.join(config.events.eventDir(req.params.id),"registration.pdf"))
});
  
routes.post("event:registration","/registration",{permission:"events:registration:edit"}).handle(upload.single("file"), async (req,res,next) => {
  
  var event = await Event.findOne({_id:req.params.id});
  
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

routes.delete("event:registration","/registration",{permission:"events:registration:delete"}).handle(async (req,res,next) => {
  var event = await Event.findOne({_id:req.params.id});
  
  if(!event.registration) return res.sendStatus(404);
  
  var registrationFile = path.join(config.events.storageDir,String(event._id),event.registration);
  await rmfr(registrationFile);
  
  event.registration = null;
  await event.save();
  
  res.sendStatus(204);
});

routes.post("event:publish","/actions/publish", {permission:"events:publish", hideRoot: true, query: {status: "draft"}}).handle(async (req,res,next) => {
  var event = await Event.findOne({_id:req.params.id});
  
  event.status = "public";
  
  await event.save();
  
  res.sendStatus(200);
});

