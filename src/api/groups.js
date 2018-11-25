var express = require("express");
var router = module.exports = express.Router();

var acl = require("express-dynacl");

var Group = require("../models/group");
var Member = require("../models/member");

router.get("/", acl("groups:list"), async (req,res) => {
  let groups = Group.find().select("_id name color");
  res.json(await groups);
});

router.post("/", acl("groups:create"), async (req,res) => {
  var group = Group.create(req.body);
  res.json(await group);
});

router.get("/:group", acl("groups:read"), async (req,res) => res.json(await Group.findOne({_id:req.params.group})) );

router.patch("/:group", acl("groups:edit"), async (req,res) => {
  await Group.findOneAndUpdate({_id:req.params.group},req.body)
  res.sendStatus(204);
});

router.delete("/:group", acl("groups:delete"), async (req,res) => {
  await Group.deleteOne({_id:req.params.group});
  res.sendStatus(204);
});

router.get("/:group/members", acl("groups:members:read"), async (req,res) => {
  const members = Member.find({group:req.params.group});
  res.json(await members);
});