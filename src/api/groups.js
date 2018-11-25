const express = require("express");
const expressRouter = module.exports = express.Router();

const acl = require("express-dynacl");

const config = require("../../config");

const routes = require("../middleware/routes");
const router = routes.router(expressRouter,{root:config.api.root + "/groups"});

const Group = require("../models/group");
const Member = require("../models/member");

router.get("groups:self", "/").handle( acl("groups:list"), routes.mongoose.list(Group));

router.get("group:self", "/:id").handle( acl("groups:read"), routes.mongoose.get(Group,req => ({_id:req.params._id})));

router.get("group:members", "/:id/members", {}).handle(acl("groups:members:list"), async (req,res) => {
  res.json(await Member.find({group:req.params.id}).select("_id nickname name"))
});

router.post("group:publish", "/:id/actions/publish", {}).handle(acl("groups:publish"), async (req,res) => {
});