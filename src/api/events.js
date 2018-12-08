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
        ]}
      },
      additionalProperties: false
    },
    "select": { type: "string" },
    "populate": { type: "array", items: { enum: ["leaders","attendees"] } },
    "search": { type: "string" },
    "has_actions": { type: "string" },
    "sort": { type: "string", enum: ["dateFrom","-dateFrom","name","-name"] },
    "skip": { type: "number" },
    "limit": { type: "number" },
  },
  additionalProperties: false
};

routes.get("events","/",{permission:"events:list"}).handle(validate({query:getEventsSchema}), async (req,res,next) => {

  // construct the query
  const query = Event.find();

  if(req.query.filter) query.where(req.query.filter);
  if(req.query.search) query.where({ name: new RegExp(req.query.search,"i") });
  if(req.query.has_actions) query.hasActions(req.query.has_actions.split(" "));

  query.select(req.query.select || "_id name dateFrom dateTill type status");
  if(req.query.populate) query.populate(req.query.populate);

  query.limit(req.query.limit ? Math.min(req.query.limit,100) : 20);
  if(req.query.skip) query.skip(req.query.skip);
  if(req.query.sort) query.sort(req.query.sort.replace(/(\-?)([a-z]+)/i,"$1$2 $1order"));

  res.json({
    docs: await query,
    total: await Event.find().where(req.query.filter || {}).count(),
    limit: req.query.limit || 20,
    skip: req.query.skip || 0
  });

});

routes.post("events","/",{permission:"events:create"}).handle(async (req,res,next) => {

  var event = await createEvent(req.body);
  res.location(`${config.api.root}/events/${event._id}`);
  res.sendStatus(201);
});     

var getEventsUpcomingSchema = {
  type: 'object',
  properties: {
    "limit":{ type: "number" },
    "days":{ type: "number" }
  }
};