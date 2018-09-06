var express = require("express");
var router = module.exports = express.Router();

var path = require("path");

var config = require("../../config");

var acl = require("express-dynacl");

router.get("/", acl("versions:read"), (req,res) => {
  
  if(!config.versions) return res.sendStatus(404);
  
  var versions = {};
  
  Object.entries(config.versions).forEach(package => {
    var packageJson = require(path.join(package[1],"package.json"));
    versions[package[0]] = packageJson.version;
  });
  
  res.json(versions);
  
});