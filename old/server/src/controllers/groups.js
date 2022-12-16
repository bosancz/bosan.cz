const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

const config = require("../config");

const Group = require("../models/group");
const Member = require("../models/member");

routes.get("groups", "/",{permission:"groups:list"}).handle(async (req,res) => {
  var groups = Group.find();
  
  groups = req.routes.links(groups,"group");
  
  res.json(await groups)
});

routes.get("group", "/:_id",{permission:"groups:read"}).handle(async (req,res) => {
  var group = Group.findOne({_id:req.params._id});
  res.json(await req.routes.links(group,"group"));
});