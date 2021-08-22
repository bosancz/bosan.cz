import { Routes } from "@smallhillcz/routesjs";
const routes = (module.exports = new Routes());

import config from "../config";

import User from "../models/user";

import { listNotifications } from "../notifications";

routes.get("notifications", "/", { permission: "notifications:list" }).handle((req, res) => {
  res.json(listNotifications());
});

routes.get("notifications:key", "/key", { permission: "notifications:key:read" }).handle((req, res) => {
  res.send(config.keys.vapid.publicKey);
});
