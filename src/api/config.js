var express = require("express");
var router = module.exports = express.Router();

var fs = require("fs");
var path = require("path");

var configFile = path.join(__dirname,"../../data/config.json");

router.get("/", (req,res,next) => res.sendFile(configFile));

router.put("/", (req,res,next) => {
  fs.writeFile(configFile,JSON.stringify(req.body),err => {
    if(err) return next(err);
    res.sendStatus(200);
  });
});