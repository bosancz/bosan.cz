const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

const config = require("../config");

const User = require("../models/user");

const { listNotifications } = require("../notifications");

routes.get("notifications", "/", {permission:"notifications:list"}).handle((req,res) => {
  res.json(listNotifications());
});

routes.get("notifications:key", "/key", {permission:"notifications:key:read"}).handle((req,res) => {
  res.send(config.keys.vapid.publicKey);
});