const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

const config = require("../config");

const { DateTime } = require("luxon");
const ical = require('ical-generator');

var validate = require("../validator");

var Event = require("../models/event");

const getEventsProgramSchema = {
  type: 'object',
  properties: {
    "dateFrom": { type: "string", format: "date" },
    "dateTill": { type: "string", format: "date" },
    "limit": { type: "number" }
  },
  additionalProperties: false
};

routes.get("program", "/", { permission: "program:read" }).handle(validate({ query: getEventsProgramSchema }), async (req, res, next) => {


  const query = Event.find({ status: { $in: ["public", "cancelled"] } }, null, { autopopulate: false });

  query.select("_id name status dateFrom dateTill groups leadersEvent description type subtype meeting registration");
  query.populate("leaders", "_id name nickname group contacts.mobile");

  const today = new Date();
  today.setDate(today.getDate() - 3);

  query.where({ dateTill: { $gte: req.query.dateFrom ? new Date(req.query.dateFrom) : today } });
  if (req.query.dateTill) query.where({ dateFrom: { $lte: new Date(req.query.dateTill) } });

  query.sort("dateFrom order");
  query.limit(req.query.limit ? Math.min(100, Number(req.query.limit)) : 100);

  const program = await query.toObject();

  req.routes.links(program, "event");

  res.json(program);
});

routes.get("program:ical", "/ical", { permission: "program:read" }).handle(async (req, res, next) => {

  const cal = ical({
    domain: config.ical.domain,
    name: "Bošán - Program akcí",
    timezone: config.ical.timezone,
    method: "publish"
  });

  const from = DateTime.local().minus({ days: 30 });

  const query = Event.find({
    status: "public",
    dateTill: { $gte: from.toJSDate() },
  });
  query.select("_id name dateFrom dateTill groups leadersEvent description type subtype");
  query.populate("leaders", "_id nickname contacts.email");

  const events = await query;

  for (let event of events) {
    let ev = cal.createEvent({
      uid: event._id,
      start: event.dateFrom,
      end: DateTime.fromJSDate(event.dateTill).plus({ days: 1 }).toJSDate(), // DTEND is non inclusive (https://tools.ietf.org/html/rfc5545#section-3.6.1)
      allDay: true,
      summary: event.name,
      url: event._links && event._links.registration_url,
      busystatus: "busy",
      description: event.description,
      location: event.place,
      organizer: config.ical.organizer,
      attendees: event.leaders.map(member => ({ name: member.nickname, email: member.contacts && member.contacts.email || "info@bosan.cz", rsvp: true })),
      timezone: config.ical.timezone
    });

  }

  cal.serve(res);

});

routes.get("program:stats", "/stats", { permission: "program:stats" }).handle(async (req, res, next) => {

  const stats = {}
  const status = await Event.aggregate([
    { $match: { dateFrom: { $gte: new Date() } } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
    { $project: { _id: false, status: "$_id", count: "$count" } }
  ]);


  stats.count = status.map(item => item.count).reduce((acc, cur) => acc + cur, 0);
  stats.status = status.reduce((acc, cur) => { acc[cur.status] = cur.count; return acc; }, {});

  res.json(stats);
});