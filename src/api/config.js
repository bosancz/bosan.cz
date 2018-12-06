const config = require("../../config");

const { Routes } = require("../../lib/routes");
const routes = new Routes({url:config.api.root + "/config", routerOptions: { mergeParams: true }});
module.exports = routes.router;

var fs = require("fs");
var path = require("path");

var acl = require("express-dynacl");

var configFile = path.join(__dirname,"../../data/web-config.json");

routes.get("config","/").handle(acl("config:read"), (req,res,next) => res.sendFile(configFile));

routes.put("config","/").handle(acl("config:edit"), (req,res,next) => {
  fs.writeFile(configFile,JSON.stringify(req.body),err => {
    if(err) return next(err);
    res.sendStatus(200);
  });
});