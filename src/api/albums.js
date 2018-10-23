const express = require("express");
const router = module.exports = express.Router();

const fs = require("fs-extra");
const path = require("path");
const rmfr = require("rmfr");

const mongoose = require("mongoose");

const acl = require("express-dynacl");
const validate = require("../validator");

const config = require("../../config");

const Album = require("../models/album");
const Photo = require("../models/photo");

const albumDownload = require("./albums/album-download");

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
  const album = await Album.create(req.body);

  await fs.mkdir(config.photos.storageDir(album._id));
  await fs.mkdir(config.photos.thumbsDir(album._id));

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

router.get("/recent", acl("albums:recent:list"), async (req,res) => {
  
  var albums = Album.find({status:"public"}).sort("-datePublished").populate("titlePhotos");
  
  albums.limit(req.query.limit ? Math.min(10,req.query.limit) : 5);
  
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

  const album = await Album.findOne({_id:req.params.album});

  await rmfr(config.photos.storageDir(album._id));
  await rmfr(config.photos.thumbsDir(album._id));
  
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

router.get("/:album/download", acl("albums:download"), (req,res,next) => {

  res.writeHead(200, {
    'Content-Type': 'application/zip',
    'Content-disposition': 'attachment; filename=album.zip'
  });

  albumDownload(req.params.album,res)
    .catch(err => res.status(500).send(err.message));
});