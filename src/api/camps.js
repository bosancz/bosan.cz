var express = require("express");
var router = module.exports = express.Router();

var Camp = require("../models/camp");

router.get("/", (req,res,next) => Camp.find().select("name dateFrom dateTill theme").res(res,next) );

router.get("/:camp", (req,res,next) => Camp.findOne({_id:req.params.camp}).res(res,next) );

router.put("/:camp", (req,res,next) => {
  
  console.log(req.body);
  Camp
    .findOneAndUpdate({_id:req.params.camp},req.body,{new:true})
    .select("name dateFrom dateTill theme")
    .res(res,next);
});