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

  var query = Album.find({});

  if(req.query.year) query.where("year",Number(req.query.year));
  if(req.query.events) query.populate("event","_id name dateFrom dateTill");
  if(req.query.sort) query.sort(req.query.sort);
  
  if(req.query.titlePhoto) query.populate("titlePhoto");

  query.limit(req.query.limit ? Math.min(req.query.limit,100) : 100);

  res.json(await query);
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
router.get("/years", acl("albums:years:list"), async (req,res,next) => {
  res.json(await Album.distinct("year"))
});

// GET ALBUM BY ID
router.get("/:album", acl("albums:read"), async (req,res,next) => {
  
  var query = Album.findOne({_id: req.params.album})
  
  if(req.query.photos) query.populate("photos");
  if(req.query.titlePhoto) query.populate("titlePhoto");
  
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