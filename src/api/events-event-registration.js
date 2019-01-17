const config = require("../../config");

const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

var fs = require("fs-extra");
var path = require("path");
var rmfr = require("rmfr");

var multer = require("multer");
var upload = multer({ dest: config.uploads.dir })

var validate = require("../validator");

var Event = require("../models/event");

routes.get("event:registration","/",{ permission:"events:registration:read", query: { registration: { $exists: true, $ne: null } } }).handle(async (req,res,next) => {
  const registrationPath = path.join(config.events.eventDir(req.params.id),"registration.pdf");
  if(await fs.pathExists(registrationPath)) res.sendFile(registrationPath);
  else res.sendStatus(404);
});
  
routes.post("event:registration","/",{permission:"events:registration:edit"}).handle(upload.single("file"), async (req,res,next) => {
  
  var event = await Event.findOne({_id:req.params.id});
  
  try{

    var file = req.file;
    if(!file) throw new Error("Missing file");

    var eventDir = path.join(config.events.storageDir,String(event._id));
    var originalPath = req.file.path;
    var storagePath = path.join(eventDir,"registration.pdf");

    await fs.ensureDir(eventDir);
    
    await rmfr(storagePath);
    
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

routes.delete("event:registration","/",{permission:"events:registration:delete"}).handle(async (req,res,next) => {
  var event = await Event.findOne({_id:req.params.id});
  
  if(!event.registration) return res.sendStatus(404);
  
  var registrationFile = path.join(config.events.storageDir,String(event._id),event.registration);
  await rmfr(registrationFile);
  
  event.registration = null;
  await event.save();
  
  res.sendStatus(204);
});