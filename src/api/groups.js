var express = require("express");
var expressRouter = module.exports = express.Router();

var acl = require("express-dynacl");

const config = require("../../config");
var restful = require("../middleware/restify");
var router = restful.router(expressRouter,{root:config.api.root + "/groups"});

var Group = require("../models/group");
var Member = require("../models/member");

router.get("groups:self", {
  path: "",
  middleware: [ acl("groups:list") ],
  handler: restful.mongoose.list(Group)
});

router.get("group:self", {
  path: "/:id",
  middleware: [ acl("groups:read") ],
  handler: restful.mongoose.get(Group)
});

router.get("group:members", {
  path: "/:id/members",
  middleware: [ acl("groups:members:list") ],
  handler: async (req,res) => res.json(await Member.find({group:req.params.id}).select("_id nickname name"))
});

router.post("group:publish", {
  path: "/:id/actions/publish",
  query: { status: "draft" },
  access: acl("groups:publish"),
  handler: restful.mongoose.action(Group,group => group.status = "public")
});