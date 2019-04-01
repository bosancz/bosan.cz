const config = require("../../config");

const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

var fs = require("fs");
var path = require("path");

var configFile = path.join(__dirname,"../../data/web-config.json");

routes.get("config", "/", {permission:"config:read"}).handle((req,res,next) => res.sendFile(configFile));

routes.put("config", "/", {permission:"config:edit"}).handle((req,res,next) => {
  fs.writeFile(configFile,JSON.stringify(req.body),err => {
    if(err) return next(err);
    res.sendStatus(200);
  });
});