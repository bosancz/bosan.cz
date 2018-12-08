const config = require("../../config");

const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

var Member = require("../models/member");

routes.get("members","/",{permission:"members:list"}).handle(async (req,res,next) => {
  
  var members = Member.find({}).select("_id nickname name group role");
  
  if(req.query.group) members.where({"group":req.query.group});
  
  res.json(await members);
});

routes.post("members","/",{permission:"members:list"}).handle(async (req,res) => {
  var member = await Member.create(req.body);
  res.status(201).json(member);
});

routes.get("member","/:id",{permission:"members:read"}).handle(async (req,res,next) => {
  res.json(await Member.findOne({_id:req.params.id}));
});

routes.patch("member","/:id",{permission:"members:edit"}).handle(async (req,res,next) => {
  await Member.findOneAndUpdate({_id:req.params.id},req.body)
  res.sendStatus(204);
});

routes.delete("member","/:id",{permission:"members:delete"}).handle(async (req,res,next) => {
  await Member.remove({_id:req.params.id})
  res.sendStatus(204);
});