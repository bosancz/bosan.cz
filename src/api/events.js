var express = require("express");
var router = module.exports = express.Router();

var acl = require("express-dynacl");

var Event = require("../models/event");

router.get("/", acl("events:list"), async (req,res,next) => {
  
  var query = {};
  
  if(!await acl.can("events:list-drafts",req)) query.status = "public";
  
  Event.find(query).res(res,next);
});

router.post("/", (req,res,next) => {
  Event.create(req.body)
    .then(event => res.json(event))
    .catch(err => next(err));
});            
            
router.get("/upcoming", (req,res,next) => {
  
  Event
    .find({dateTill : {$gt: new Date()}})
    .select("_id name dateFrom dateTill description groups") 
    .where("status","public")
    .limit(5)
    .res(res,next)
});

/* SIGNLE EVENT */
router.get("/:event", acl("events:read"), (req,res,next) => Event.findOne({_id:req.params.event}).req(req).res(res,next));

router.put("/:event", (req,res,next) => {
  Event.findOneAndUpdate({_id:req.params.event},req.body,{new:true})
    .then(event => res.json(event))
    .catch(err => next(err));
});

router.delete("/:event", (req,res,next) => {
  Event.remove({_id:req.params.event})
    .then(() => res.sendStatus(200));
});



