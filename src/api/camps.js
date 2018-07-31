var express = require("express");
var router = module.exports = express.Router();

var acl = require("express-dynacl");

var Camp = require("../models/camp");

router.get("/", acl("camps:list"), async (req,res) => res.json(await Camp.find().select("name dateFrom dateTill theme")) );

router.get("/:camp", acl("camps:read"), async (req,res) => res.json(await Camp.findOne({_id:req.params.camp})) );

router.patch("/:camp", acl("camps:update"), async (req,res) => {
  
  await Camp.findOneAndUpdate({_id:req.params.camp},req.body)
  
  res.sendStatus(204);
  
});