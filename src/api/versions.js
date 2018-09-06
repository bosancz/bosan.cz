var express = require("express");
var router = module.exports = express.Router();

var config = require("../../config");

var acl = require("express-dynacl");

router.get("/", acl("versions:read"), (req,res) => {
  res.sendStatus(200);
});