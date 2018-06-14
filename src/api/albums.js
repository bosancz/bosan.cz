var express = require("express");
var router = module.exports = express.Router();

var Album = require("../models/album");

// LIST ALBUMS
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

// CREATE NEW ALBUM */
router.post("/", (req,res,next) => Album.create(req.body).res(res,next));

// GET THE DISTINCT YEARS OF ALBUMS
router.get("/years", (req,res,next) => Album.distinct("year").res(res,next));

// GET ALBUM BY ID
router.get("/:album", (req,res,next) => Album.findOne({_id: req.params.album}).resJSON(res,next));

// UPDATE ALBUM AT ID
router.put("/:album",(req,res,next) => Album.findOneAndUpdate({_id: req.params.album}).resStatus(res,next));

router.post("/:album/photos",(req,res,next) => {
  
});