const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

const config = require("../../config");


var fs = require("fs-extra");

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
        "dateTill": { anyOf: [
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
        ]},
        "status": { type: "string", enum: ["public","draft"] }       
      },
      additionalProperties: false
    },
    "select": { type: "string" },
    "populate": { type: "array", items: { enum: ["leaders","attendees"] } },
    "search": { type: "string" },
    "has_action": { type: "string" },
    "sort": { type: "string", enum: ["dateFrom","-dateFrom","name","-name"] },
    "skip": { type: "number" },
    "limit": { type: "number" },
  },
  additionalProperties: false
};

routes.get("events","/").handle(validate({query:getEventsSchema}), async (req,res,next) => {

  // construct the query
  const query = Event.find().permission("events:list",req);

  if(req.query.filter) query.where(req.query.filter);
  if(req.query.search) query.where({ name: new RegExp(req.query.search,"i") });
  if(req.query.has_action){
    const route = req.routes.findRoute("event",req.query.has_action,"action");
    query.where(route.query || {});
  }
  
  query.select(req.query.select || "_id name dateFrom dateTill type status");
  if(req.query.populate) query.populate(req.query.populate);

  if(req.query.sort) query.sort(req.query.sort.replace(/(\-?)([a-z]+)/i,"$1$2 $1order"));

  const limit = req.query.limit ? Math.min(req.query.limit,100) : 20;
  const skip = req.query.skip || 0;
  
  const events = await query.paginate(limit,skip);
  
  req.routes.links(events.docs,"event"),
    
  res.json(events);

});

routes.post("events","/",{permission:"events:create"}).handle(async (req,res,next) => {
  var event = await createEvent(req.body);
  res.location(`/events/${event._id}`);
  res.sendStatus(201);
});

routes.get("events:noleader","/noleader",{permission:"events:noleader:list"}).handle(async (req,res,next) => {

  // construct the query
  const events = await Event.find({ leaders: { $size: 0 }, dateFrom: { $gte: new Date() } }).select("_id name dateFrom dateTill description leaders").toObject();
 
  req.routes.links(events,"event");
 
  res.json(events);

});