const config = require("../../config");

const { Routes } = require("../../lib/routes");
const routes = new Routes({url:config.api.root + "/members"});
module.exports = routes.router;

var acl = require("express-dynacl");

var Member = require("../models/member");

routes.get("members","/").handle(acl("members:list"), async (req,res,next) => {
  
  var members = Member.find({}).select("_id nickname name group role");
  
  if(req.query.group) members.where({"group":req.query.group});
  
  res.json(await members);
});

routes.post("members","/").handle(acl("members:create"), async (req,res) => {
  var member = await Member.create(req.body);
  res.status(201).json(member);
});

routes.get("member","/:id").handle(acl("members:read"), async (req,res,next) => {
  res.json(await Member.findOne({_id:req.params.id}));
});

routes.patch("member","/:id").handle(acl("members:edit"), async (req,res,next) => {
  await Member.findOneAndUpdate({_id:req.params.id},req.body)
  res.sendStatus(204);
});

routes.delete("member","/:id").handle(acl("members:delete"), async (req,res,next) => {
  await Member.remove({_id:req.params.id})
  res.sendStatus(204);
});