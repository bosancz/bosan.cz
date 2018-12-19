const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

var Event = require("../models/event");

routes.get("me:dashboard","/dashboard",{permission:"me:dashboard:read"}).handle(async (req,res,next) => {

  const dashboard = {};
  
  // construct the query
  dashboard.noLeaderEventsCount = await Event.countDocuments({ leaders: { $size: 0 }, dateFrom: { $gte: new Date() } });
  
  dashboard.program = await Event.find({ dateFrom: { $gte: new Date() }, status: { $in: ["public"] } }).select("_id name dateFrom dateTill leaders").populate("leaders","nickname").limit(5).toObject();
  
  req.routes.links(dashboard.program,"event");

  res.json(dashboard);

});