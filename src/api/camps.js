var express = require("express");
var router = module.exports = express.Router();

var acl = require("express-dynacl");

var Camp = require("../models/camp");

router.get("/", acl("camps:list"), async (req,res) => {
  let camps = Camp.find().select("name dateFrom dateTill theme");
  
  if(req.query.dateFrom) camps.where({dateTill: {$gte: new Date(req.query.dateFrom)}});
  if(req.query.dateTill) camps.where({dateFrom: {$lte: new Date(req.query.dateTill)}});

  res.json(await camps);
});

router.post("/", acl("camps:create"), async (req,res) => {
  var camp = Camp.create(req.body);
  res.json(await camp);
});

router.get("/:camp", acl("camps:read"), async (req,res) => res.json(await Camp.findOne({_id:req.params.camp})) );

router.patch("/:camp", acl("camps:update"), async (req,res) => {
  
  await Camp.findOneAndUpdate({_id:req.params.camp},req.body)
  
  res.sendStatus(204);
  
});

router.delete("/:camp", acl("camps:delete"), async (req,res) => {
  await Camp.deleteOne({_id:req.params.camp});
  res.sendStatus(204);
});