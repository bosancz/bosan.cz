var express = require("express");
var router = module.exports = express.Router();

var acl = require("express-dynacl");

var Member = require("../models/member");

router.get("/", acl("members:list"), async (req,res,next) => {
  res.json(await Member.find({}).select("_id nickname name group"));
});

router.get("/:id", acl("members:read"), async (req,res,next) => {
  res.json(await Member.findOne({_id:req.params.id}));
});