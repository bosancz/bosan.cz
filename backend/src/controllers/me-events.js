const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

const config = require("../config");

var fs = require("fs-extra");

var Event = require("../models/event");

routes.get("me:events","/",{permission:"me:events:list"}).handle(async (req,res,next) => {

  // construct the query
  const query = Event.find({leaders:req.user.member});

  const events = await query.toObject();

  req.routes.links(events,"event");
  res.json(events);

});