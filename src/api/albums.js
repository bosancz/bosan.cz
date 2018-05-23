var express = require("express");
var router = module.exports = express.Router();

var Album = require("../models/album");

router.get("/", (req,res,next) => {
  
  var query = Album.find({});
  
  if(req.query.year) query.where("year",Number(req.query.year));
  if(req.query.events) query.populate("event","_id name dateFrom dateTill");
  if(req.query.sort) query.sort(req.query.sort);
  
  query.limit(req.query.limit ? Math.min(req.query.limit,100) : 100);
  
  query
    .then(albums => res.json(albums))
    .catch(err => next(err));
});

router.get("/years", (req,res,next) => {
  
  Album.distinct("year")
    .then(years => res.json(years))
    .catch(err => next(err));
});

router.get("/:album", (req,res,next) => {
  
  Album.findOne({_id: req.params.album})
    .then(album => res.json(album))
    .catch(err => next(err));
});