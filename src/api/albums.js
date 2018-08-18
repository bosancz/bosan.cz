var express = require("express");
var router = module.exports = express.Router();

var fs = require("fs");
var path = require("path");
var rimraf = require("rimraf");

var mongoose = require("mongoose");

var acl = require("express-dynacl");

var config = require("../../config");

var Album = require("../models/album");
var Photo = require("../models/photo");

// LIST ALBUMS
router.get("/", acl("albums:list"), async (req,res,next) => {

  var where = {};
  if(req.query.status && req.query.status !== "all") where.status = req.query.status;
  if(!req.query.status || !await acl.can("albums:drafts:list",req)) where.status = "public";
  if(req.query.year) where.year = Number(req.query.year);
  if(req.query.dateFrom) where.dateTill = { $gte: new Date(req.query.dateFrom) };
  if(req.query.dateTill) where.dateFrom = { $lte: new Date(req.query.dateTill) };
  
  var options = {
    select: ["_id","name","status","dateFrom","dateTill","datePublished"],
    populate:[],
    limit: req.query.limit ? Math.min(req.query.limit,100) : 100,
    page: req.query.page || 1
  };
  if(req.query.sort) options.sort = req.query.sort;
  if(req.query.events) options.populate.push({path: "event", select:"_id name dateFrom dateTill"});
  if(req.query.titlePhotos) options.select.push("titlePhotos"),options.populate.push({path: "titlePhotos"});

  res.json(await Album.paginate(where,options));
});

// CREATE NEW ALBUM */
router.post("/", acl("albums:create"), async (req,res,next) => {
  var album = await Album.create(req.body);

  // create folders for photos (fs dont do promises)
  await Promise.all([
    new Promise((resolve,reject) => fs.mkdir(path.join(config.photos.storageDir,String(album._id)),err => err ? reject(err) : resolve())),
    new Promise((resolve,reject) => fs.mkdir(path.join(config.photos.thumbsDir,String(album._id)),err => err ? reject(err) : resolve()))
  ]);

  res.status(201).json(album);
});

// GET THE DISTINCT YEARS OF ALBUMS
router.get("/years", acl("albums:years:list"), async (req,res) => {
  res.json(await Album.distinct("year"))
});

// GET ALL ALBUMS NAMES AND DATES
router.get("/list", acl("albums:list"), async (req,res) => {
  
  let albums = Album.find({}).select("_id name dateFrom dateTill")
  
  if(!(req.query.drafts && await acl.can("album:drafts:list",req))) albums.where({"status": "public"});
  if(req.query.sort) albums.sort(req.query.sort);
  
  res.json(await albums);
});

// GET ALBUM BY ID
router.get("/:album", acl("albums:read"), async (req,res,next) => {
  
  var query = Album.findOne({_id: req.params.album})
  
  if(req.query.event) query.populate("event","_id name dateFrom dateTill");
  if(req.query.photos) query.populate("photos");
  if(req.query.titlePhoto) query.populate("titlePhoto");
  if(req.query.titlePhotos) query.populate("titlePhotos");
  
  res.json(await query)
});

// UPDATE ALBUM AT ID
router.patch("/:album", acl("albums:edit"), async (req,res,next) => {
  await Album.findOneAndUpdate({_id: req.params.album},req.body);
  res.sendStatus(204);
});

/// DELETE ALBUM BY ID
router.delete("/:album", acl("albums:delete"), async (req,res,next) => {
  await Album.deleteOne({_id: req.params.album});
  res.sendStatus(204);
});

router.get("/:album/photos", acl("albums:photos:read"), async (req,res,next) => {
  
  let select = {
    "status": 1,
    "photos": req.query.limit ? { $slice: Number(req.query.limit) } : 1
  };
  
  let album = await Album.findOne({_id:req.params.album},select).populate("photos");
  
  if(!album) return res.sendStatus(404);
  if(album.status === "draft" && await acl.can("album:drafts:read",req)) return res.sendStatus(401);
  
  res.json(album.photos);
});