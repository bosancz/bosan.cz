var express = require("express");
var router = module.exports = express.Router();

var fs = require("fs");
var path = require("path");
var rimraf = require("rimraf");

var mongoose = require("mongoose");

var acl = require("express-dynacl");
var validate = require("../validator");

var config = require("../../config");

var Album = require("../models/album");
var Photo = require("../models/photo");

var getAlbumsSchema = {
  type: "object",
  properties: {
    "filter": {
      type: "object",
      properties: {
        "year": { type: "number" }
      },
      additionalProperties:false
    },
    "populate": { type: "array", items: { enum: ["events","titlePhotos"] } },
    "limit": { type: "number" },
    "page": { type: "number" },
    "search": { type: "string" },
    "sort": { type: "string" }
  },
  additionalProperties: false
};

// LIST ALBUMS
router.get("/", validate({query: getAlbumsSchema}), acl("albums:list"), async (req,res,next) => {

  var where = req.query.filter || {};
  if(req.query.search) where.name = new RegExp(req.query.search,"i");
  
  var populations = {
    events: {path: "event", select:"_id name dateFrom dateTill"},
    titlePhotos: {path: "titlePhotos"}
  };
  
  var options = {
    select: ["_id","name","status","dateFrom","dateTill","datePublished","event"],
    populate: req.query.populate ? req.query.populate.map(item => populations[item]).filter(item => item) : [],
    limit: req.query.limit ? Math.min(req.query.limit,100) : 100,
    page: req.query.page || 1
  };
  if(req.query.sort) options.sort = req.query.sort;
  if(req.query.populate && req.query.populate.indexOf("titlePhotos") !== null) options.select.push("titlePhotos");

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
router.get("/years", acl("albums:list"), async (req,res) => {
  res.json(await Album.distinct("year"))
});



// GET ALL ALBUMS NAMES AND DATES

var getAlbumsListSchema = {
  type: "object",
  properties: {
    "filter": {
      type: "object",
      properties: {
        "status": { type: "string" },
      },
      additionalProperties: false
    },
    "sort": { type: "string"}
  },
  additionalProperties: false
};
      
router.get("/list", validate({query:getAlbumsListSchema}), acl("albums:list"), async (req,res) => {
  
  let albums = Album.find({}).select("_id name dateFrom dateTill")
  
  let where = req.query.filter || {};
  if(!await acl.can("albums:drafts:list",req)) where.status = "public";
  albums.where(where);
  
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

router.get("/:album/photos", acl("albums:read"), async (req,res,next) => {
  
  let select = {
    "status": 1,
    "photos": req.query.limit ? { $slice: Number(req.query.limit) } : 1
  };
  
  let album = await Album.findOne({_id:req.params.album},select).populate("photos");
  
  if(!album) return res.sendStatus(404);
  if(album.status === "draft" && !await acl.can("albums:drafts:read",req)) return res.sendStatus(401);
  
  res.json(album.photos);
});