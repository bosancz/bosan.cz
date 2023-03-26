const config = require("../config");

const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

const fs = require("fs-extra");
const path = require("path");
const xlsxPopulate = require("xlsx-populate");
const { DateTime } = require("luxon");

const multer = require("multer");
const upload = multer({ dest: config.uploads.dir })

const Event = require("../models/event");

routes.get("event:announcement","/",{permission:"events:read"}).handle(async (req,res,next) => {
  const announcementPath = path.join(config.events.eventDir(req.params.id),"announcement.xlsx");
  if(await fs.pathExists(announcementPath)) res.sendFile(announcementPath);
  else res.sendStatus(404);
});

routes.post("event:announcement","/",{permission:"events:edit"}).handle(upload.single("file"), async (req,res,next) => {
  
  var event = await Event.findOne({_id:req.params.id});
  
  try{

    var file = req.file;
    if(!file) throw new Error("Missing file");

    var eventDir = path.join(config.events.storageDir,String(event._id));
    var originalPath = req.file.path;
    var storagePath = path.join(eventDir,"announcement.xlsx");

    await fs.ensureDir(eventDir);
    
    await fs.remove(storagePath);
    
    await fs.move(originalPath,storagePath);
  }
  catch(err){
    err.name = "UploadError";
    throw err;    
  }
  
  event.announcement = "announcement.xlsx";
  await event.save()
  
  res.sendStatus(204);
});

routes.delete("event:announcement","/",{permission:"events:edit"}).handle(async (req,res,next) => {
  var event = await Event.findOne({_id:req.params.id});
  
  if(!event.announcement) return res.sendStatus(404);
  
  var announcementFile = path.join(config.events.storageDir,String(event._id),event.announcement);
  await fs.remove(announcementFile);
  
  event.announcement = null;
  await event.save();
  
  res.sendStatus(204);
});

routes.get("event:announcement-template","/template",{permission:"events:read"}).handle(async (req,res,next) => {
  
  const query = Event.findOne({_id:req.params.id},{},{ autopopulate: false });
  query.select("name place dateFrom dateTill leaders attendees meeting");
  query.populate("leaders","nickname name birthday address contacts");
  query.populate("attendees","nickname name birthday address contacts");
  //query.filterByPermission("events:read");
  
  const event = await query;
  if(!event) return res.sendStatus(404);
  
  const xlsx = await xlsxPopulate.fromFileAsync(config.events.announcement.xlsx);
  
  const sheets = {
    announcement: xlsx.sheet("Ohláška")
  };
  
  const attendeeMembers = [...(event.leaders || []),...(event.attendees || [])];  
  
  const missing = "Chybí v DB";
  
  const attendees = attendeeMembers.map(member => [
    member.name && member.name.first || missing,
    member.name && member.name.last || missing,
    member.birthday || missing,
    member.address && ((member.address.street || missing) + " " + (member.address.streetNo || "")),
    member.address && member.address.city || missing,
    member.address && member.address.postalCode || missing,
    member.contacts && member.contacts.mobile || (member.contacts.mother ? "Matka: " + member.contacts.mother : null) || (member.contacts.father ? "Matka: " + member.contacts.father : null) || missing
  ]);
  
  attendees.sort((a,b) => a[1].localeCompare(b[1]));
                                
  sheets.announcement.cell("F11").value(new Date());
  
  sheets.announcement.cell("C15").value(event.name || "");
  
  if(event.dateFrom) sheets.announcement.cell("C17").value(event.dateFrom);
  if(event.dateTill) sheets.announcement.cell("C18").value(event.dateTill);
  
  sheets.announcement.cell("C20").value(event.place || "");
  
  if(event.leaders) {
    
    const leadersString = member => member && member.name ? member.name.first + " " + member.name.last : "";
    
    sheets.announcement.cell("C22").value(leadersString(event.leaders[0]));
    sheets.announcement.cell("C23").value(leadersString(event.leaders[1] || event.leaders[0]));
    sheets.announcement.cell("C24").value(leadersString(event.leaders[2] || event.leaders[1] || event.leaders[0]));
  }
  
  if(event.meeting) {
    sheets.announcement.cell("C26").value(event.meeting.start || "");
    sheets.announcement.cell("C27").value(event.meeting.end || "");
  }
  
  sheets.announcement.cell("A32").value(attendees);
  
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  
  res.attachment(path.basename(config.events.announcement.xlsx));
  res.send(await xlsx.outputAsync());
});