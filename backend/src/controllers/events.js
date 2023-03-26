const { Routes } = require("@smallhillcz/routesjs");
const routes = (module.exports = new Routes());

var validate = require("../validator");

var createEvent = require("./events/create-event");

var Event = require("../models/event");

var getEventsSchema = {
  type: "object",
  properties: {
    filter: {
      type: "object",
      properties: {
        year: { type: "number" },
        dateFrom: {
          anyOf: [
            { type: "string" },
            {
              type: "object",
              properties: {
                $gte: {
                  anyof: [
                    { type: "string", format: "date" },
                    { type: "string", format: "date-time" },
                  ],
                },
                $lte: {
                  anyof: [
                    { type: "string", format: "date" },
                    { type: "string", format: "date-time" },
                  ],
                },
              },
              additionalProperties: false,
            },
          ],
        },
        dateTill: {
          anyOf: [
            { type: "string" },
            {
              type: "object",
              properties: {
                $gte: {
                  anyof: [
                    { type: "string", format: "date" },
                    { type: "string", format: "date-time" },
                  ],
                },
                $lte: {
                  anyof: [
                    { type: "string", format: "date" },
                    { type: "string", format: "date-time" },
                  ],
                },
              },
              additionalProperties: false,
            },
          ],
        },
        leaders: {
          anyOf: [
            { type: "string" },
            { type: "array", items: { type: "string" } },
            { type: "object", properties: { $size: { type: "number" } }, additionalProperties: false },
          ],
        },
        type: {
          anyOf: [
            { type: "string" },
            { type: "object", properties: { $ne: { type: "string" } }, additionalProperties: false },
          ],
        },
        status: {
          anyOf: [
            { type: "string", enum: ["draft", "pending", "public", "cancelled"] },
            { type: "array", items: { type: "string", enum: ["draft", "pending", "public", "cancelled"] } },
          ],
        },
      },
      additionalProperties: false,
    },
    search: { type: "string" },
    select: { type: "string" },
    has_action: { type: "string" },
    sort: { type: "string", enum: ["dateFrom", "-dateFrom", "name", "-name"] },
    skip: { type: "number" },
    limit: { type: "number" },
  },
  additionalProperties: false,
};

routes
  .get("events", "/", { permission: "events:list" })
  .handle(validate({ query: getEventsSchema }), async (req, res, next) => {
    // construct the query
    const query = Event.find();
    query.filterByPermission("events:list", req);

    query.select(req.query.select || "_id name dateFrom dateTill type status statusNote");

    query.limit(Math.min(req.query.limit || 200, 200));
    if (req.query.skip) query.skip(req.query.skip);

    if (req.query.sort) query.sort(req.query.sort.replace(/(\-?)([a-z]+)/i, "$1$2 $1order"));

    if (req.query.filter) query.where(req.query.filter);

    if (req.query.has_action) {
      const route = req.routes.findRoute("event", req.query.has_action, "action");
      query.where(route.query || {});
    }

    if (req.query.search) {
      const searchString = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
      query.where({ name: new RegExp(searchString, "i") });
    }

    const events = await query.toObject();

    req.routes.links(events, "event");

    res.json(events);
  });

routes.post("events", "/", { permission: "events:create" }).handle(async (req, res, next) => {
  var event = await createEvent(req.body);
  res.location(`/events/${event._id}`);
  res.sendStatus(201);
});

routes.get("events:search", "/search", { permission: "events:list" }).handle(async (req, res, next) => {
  if (!req.query.search) return res.status(400).send("Missing search parameter");

  const events = await Event.find({ name: new RegExp(req.query.search, "i") })
    .limit(20)
    .sort("-dateFrom")
    .select("_id name status dateFrom dateTill");

  req.routes.links(events, "event");

  res.json(events);
});

routes.get("events:noleader", "/noleader", { permission: "events:noleader:list" }).handle(async (req, res, next) => {
  // construct the query
  const query = Event.find({ leaders: { $size: 0 }, dateFrom: { $gte: new Date() } });
  query.select("_id name dateFrom dateTill description leaders status statusNote");
  query.filterByPermission("events:noleader:list", req);

  if (req.query.sort) query.sort(req.query.sort);

  const events = await query.toObject();

  req.routes.links(events, "event");

  res.json(events);
});

routes.get("events:years", "/years", { permission: "events:list" }).handle(async (req, res, next) => {
  const years = await Event.aggregate([
    { $project: { year: { $year: "$dateFrom" } } },
    { $group: { _id: null, years: { $addToSet: "$year" } } },
  ]);
  res.json(years[0] ? years[0].years || [] : []);
});
