var express = require("express");
var router = module.exports = express.Router();

var Event = require("../models/event");

router.get("/", Event.find({}).middleware() );

router.get("/upcoming", (req,res,next) => {
  
  Event
    .find({dateTill : {$gt: new Date()}})
    .select("_id name dateFrom dateTill description groups") 
    .where("status","public")
    .limit(5)
    .res(res,next)
});

router.get("/:event", (req,res,next) => Event.findOne({_id:req.params.event}).req(req).res(res,next));