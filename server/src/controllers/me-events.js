import { Routes } from "@smallhillcz/routesjs";
const routes = (module.exports = new Routes());

import config from "../config";

import fs from "fs-extra";

import Event from "../models/event";

routes.get("me:events", "/", { permission: "me:events:list" }).handle(async (req, res, next) => {
  // construct the query
  const query = Event.find({ leaders: req.user.member });

  const events = await query.toObject();

  req.routes.links(events, "event");
  res.json(events);
});
