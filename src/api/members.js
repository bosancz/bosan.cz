var express = require("express");
var router = module.exports = express.Router();

var acl = require("express-dynacl");

var Member = require("../models/member");

router.get("/", acl("members:list"), async (req,res,next) => {
  
  var members = Member.find({}).select("_id nickname name group role");
  
  if(req.query.group) members.where({"group":req.query.group});
  
  res.json(await members);
});

router.post("/", acl("members:create"), async (req,res) => {
  var member = await Member.create(req.body);
  res.status(201).json(member);
});

router.get("/:id", acl("members:read"), async (req,res,next) => {
  res.json(await Member.findOne({_id:req.params.id}));
});

router.patch("/:id", acl("members:edit"), async (req,res,next) => {
  await Member.findOneAndUpdate({_id:req.params.id},req.body)
  res.sendStatus(204);
});

router.delete("/:id", acl("members:delete"), async (req,res,next) => {
  await Member.remove({_id:req.params.id})
  res.sendStatus(204);
});