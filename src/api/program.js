const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

const config = require("../../config");

const moment = require("moment");
const ical = require('ical-generator');

var validate = require("../validator");

var Event = require("../models/event");

const getEventsProgramSchema = {
  type: 'object',
  properties: {
    "dateFrom": {type: "string", format: "date"},
    "dateTill": {type: "string", format: "date"},
    "limit": {type: "number"}
  },
  additionalProperties: false
};

routes.get("program","/",{permission:"program:read"}).handle(validate({query:getEventsProgramSchema}), async (req,res,next) => {

  
  const query = Event.find({status:"public"});

  query.select("_id name dateFrom dateTill groups leadersEvent description type subtype meeting registration");
  query.populate("leaders","_id name nickname group contacts.mobile");

  query.where({ dateTill: { $gte: req.query.dateFrom ? new Date(req.query.dateFrom) : new Date() } });
  if(req.query.dateTill) query.where({ dateFrom: { $lte: new Date(req.query.dateTill) } });

  query.sort("dateFrom order");  
  query.limit(req.query.limit ? Math.min(100,Number(req.query.limit)) : 100);

  res.json(await query);
});

routes.get("program:ical","/ical",{permission:"program:read"}).handle(async (req,res,next) => {
  
  const cal = ical({
    domain: config.ical.domain,
    name: "Bošán - Program akcí",
    timezone: config.ical.timezone,
    method: "publish"
  });
  
  const from = moment().subtract(30, 'days');
  
  const query = Event.find({ status: "public", dateTill: { $gte: from }, recurring: req.query.recurring ? undefined : null});
  query.select("_id name dateFrom dateTill groups leadersEvent description type subtype");
  query.populate("leaders","_id nickname contacts.email");
  
  const events = await query;
  
  console.log(events.length);

  for(let event of events){
    cal.createEvent({
      uid: event._id,
      start: event.dateFrom,
      end: event.dateTill,
      allDay: true,
      summary: event.name,
      url: event._links && event._links.registration_url,
      busystatus: "busy",
      description: event.description,
      location: event.place,      
      organizer: config.ical.organizer,
      attendees: event.leaders.map(member => ({name: member.nickname, email: member.contacts && member.contacts.email || "info@bosan.cz", rsvp: true}))
    });
  }

  cal.serve(res);
  
});