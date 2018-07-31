var express = require("express");
var router = module.exports = express.Router();

var acl = require("express-dynacl");

var config = require("../../config");

var Photo = require("../models/photo");

// LIST ALBUMS
router.get("/", acl("photos:list"), async (req,res,next) => {

  var query = Photo.find({});

  if(req.query.tag) query.where("tags",req.query.tag);
  if(req.query.albums) query.populate("event","_id name dateFrom dateTill");
  if(req.query.sort) query.sort(req.query.sort);

  query.limit(req.query.limit ? Math.min(req.query.limit,100) : 100);

  res.json(await query);
});

router.get("/tags", acl("albums:tags:list"), async (req,res,next) => {
  var tags = await Photo.distinct("tags");
  res.json(tags.filter(item => item !== null));
});