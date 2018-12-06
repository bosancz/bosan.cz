const { Routes } = require("../../lib/routes");

const acl = require("express-dynacl");

const config = require("../../config");

const routes = new Routes({url:config.api.root + "/groups"});
module.exports = routes.router;

const Group = require("../models/group");
const Member = require("../models/member");

routes.get("groups:self", "/").handle( acl("groups:list"), async (req,res) => res.json(await Group.find()));

routes.get("group:self", "/:group").handle( acl("groups:read"), async (req,res) => res.json(Group.findOne({_id:req.params.group})));

routes.get("group:members", "/:id/members", {}).handle(acl("groups:members:list"), async (req,res) => {
  res.json(await Member.find({group:req.params.id}).select("_id nickname name"))
});