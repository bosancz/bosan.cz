const config = require("../config");

const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

var fs = require("fs-extra");
var path = require("path");

var configFile = path.resolve(config.storage.config, "web-config.json");

routes.get("config", "/", { permission: "config:read" }).handle(async (req, res, next) => {
  if (await fs.pathExists(configFile)) {
    res.sendFile(configFile)
  }
  else {
    res.json({});
  }
});

routes.put("config", "/", { permission: "config:edit" }).handle(async (req, res, next) => {
  await fs.writeFile(configFile, JSON.stringify(req.body));
  res.sendStatus(200);
});