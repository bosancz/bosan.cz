const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

const { DateTime } = require("luxon");

const config = require("../../config");


var fs = require("fs-extra");

var multer = require("multer");
var upload = multer({ dest: config.uploads.dir })

var validate = require("../validator");

var createEvent = require("./events/create-event");
var deleteEvent = require("./events/delete-event");

var Event = require("../models/event");
var Member = require("../models/member");
var EventRecurring = require("../models/event-recurring");

var getEventsSchema = {
  type: 'object',
  properties: {
    "filter":{
      type: "object",
      properties: {
        "dateFrom": { anyOf: [
          { type: "string" }, 
          { type: "object", properties: {"$gte": { anyof: [{type: "string", format: "date"}, {type: "string", format: "date-time"}] },"$lte": { anyof: [{type: "string", format: "date"}, {type: "string", format: "date-time"}] } }, additionalProperties: false}
        ]},
        "dateTill": { anyOf: [
          { type: "string" }, 
          { type: "object", properties: {"$gte": { anyof: [{type: "string", format: "date"}, {type: "string", format: "date-time"}] },"$lte": { anyof: [{type: "string", format: "date"}, {type: "string", format: "date-time"}] }}, additionalProperties: false}
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
        "status": { anyOf: [
          { type: "string", enum: ["draft","pending","public","cancelled"] },
          { type: "array", items: { type: "string", enum: ["draft","pending","public","cancelled"] } }
        ]}
      },
      additionalProperties: false
    },
    "select": { type: "string" },
    "populate": { type: "array", items: { enum: ["leaders"] } }, // TODO remove, but check requests due to additionalProperties: false
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
  const query = Event.find();
  query.filterByPermission("events:list",req);

  // angular fix, https://github.com/angular/angular/issues/18884 not possible to implement on client side as plus URL replacement would become double encoded
  // TODO: after fix comes, remove, despite will not cause problems when not removed
  if(req.query.filter){
    if(typeof req.query.filter.dateFrom === "string") req.query.filter.dateFrom = req.query.filter.dateFrom.replace(" ","+");
    else if(req.query.filter.dateFrom && req.query.filter.dateFrom.$gte) req.query.filter.dateFrom.$gte = req.query.filter.dateFrom.$gte.replace(" ","+");
    else if(req.query.filter.dateFrom && req.query.filter.dateFrom.$lte) req.query.filter.dateFrom.$lte = req.query.filter.dateFrom.$lte.replace(" ","+");
    if(typeof req.query.filter.dateTill === "string") req.query.filter.dateTill = req.query.filter.dateTill.replace(" ","+");
    else if(req.query.filter.dateTill && req.query.filter.dateTill.$gte) req.query.filter.dateTill.$gte = req.query.filter.dateTill.$gte.replace(" ","+");
    else if(req.query.filter.dateTill && req.query.filter.dateTill.$lte) req.query.filter.dateTill.$lte = req.query.filter.dateTill.$lte.replace(" ","+");
  }

  if(req.query.filter && Array.isArray(req.query.filter.status)) req.query.filter.status = { $in: req.query.filter.status };

  if(req.query.filter) query.where(req.query.filter);
  if(req.query.search) query.where({ name: new RegExp(req.query.search,"i") });
  if(req.query.has_action){
    const route = req.routes.findRoute("event",req.query.has_action,"action");
    query.where(route.query || {});
  }

  query.select(req.query.select || "_id name dateFrom dateTill type status statusNote");

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
  const query = Event.find({ leaders: { $size: 0 }, dateFrom: { $gte: new Date() } })
  query.select("_id name dateFrom dateTill description leaders status statusNote");
  query.filterByPermission("events:noleader:list",req);

  const events = await query.toObject();

  req.routes.links(events,"event");

  res.json(events);

});
