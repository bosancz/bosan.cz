var express = require("express");
var router = module.exports = express.Router();

var fs = require("fs");
var path = require("path");

var acl = require("express-dynacl");

var configFile = path.join(__dirname,"../../data/web-config.json");

router.get("/", acl("config:read"), (req,res,next) => res.sendFile(configFile));

router.put("/", acl("config:edit"), (req,res,next) => {
  fs.writeFile(configFile,JSON.stringify(req.body),err => {
    if(err) return next(err);
    res.sendStatus(200);
  });
});