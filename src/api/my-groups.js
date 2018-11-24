var express = require("express");
var router = module.exports = express.Router();

var acl = require("express-dynacl");

var Group = require("../models/group");
var Member = require("../models/member");

router.use("/", (req,res,next) => {
  if(!req.user || !req.user._id) return res.status(400).send("Missing user id to decide group.");
  
  Members.findOne({ _id: req.user._id }).then(member => {
    if(!member || !member.group) return res.send("User not assigned to group.");
    req.group = member.group;
    next();
  });
});
     
router.get("/", acl("my:groups:list"), async (req,res) => {
  const members = Member.find({group:req.group});
  res.json(await members);
});

router.get("/members", acl("groups:list"), async (req,res) => {
  const members = Member.find({group:req.group});
  res.json(await members);
});