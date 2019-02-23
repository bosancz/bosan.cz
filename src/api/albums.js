const config = require("../../config");

const { Routes, RoutesACL } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

const fs = require("fs-extra");
const path = require("path");
const rmfr = require("rmfr");

const mongoose = require("mongoose");

const validate = require("../validator");

const Album = require("../models/album");
const Photo = require("../models/photo");

const albumDownload = require("./albums/album-download");

var getAlbumsSchema = {
  type: "object",
  properties: {
    "filter": {
      type: "object",
      properties: {
        "year": { type: "number" },
        "status": { type: "string" }
      },
      additionalProperties:false
    },
    "sort": { type: "string" }
  },
  additionalProperties: false
};

// LIST ALBUMS
routes.get("albums","/", {permission: "albums:list"}).handle(validate({query: getAlbumsSchema}), async (req,res,next) => {

  const query = Album.find();
  query.filterByPermission("albums:drafts:list",req);
  
  query.select("_id name status dateFrom dateTill datePublished event");
  
  if(req.query.filter) query.where(req.query.filter);
  
  if(req.query.sort) query.sort(req.query.sort);
  
  const albums = await query;
  
  req.routes.links(albums,"album");

  res.json(albums);
});

// CREATE NEW ALBUM */
routes.post("albums","/", {permission: "albums:create"}).handle(async (req,res,next) => {
  const album = await Album.create(req.body);

  await fs.mkdir(config.photos.storageDir(album._id));
  await fs.mkdir(config.photos.thumbsDir(album._id));
  
  console.log(`/albums/${album._id}`);
  res.location(`/albums/${album._id}`);
  res.status(201).json(album);
});

// GET THE DISTINCT YEARS OF ALBUMS
routes.get("albums:years","/years", {permission: "albums:list"}).handle(async (req,res) => {
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
      
routes.get("albums:list","/list", {permission: "albums:list"}).handle(validate({query:getAlbumsListSchema}), async (req,res) => {
  
  let albums = Album.find({}).select("_id name dateFrom dateTill")
  
  let where = req.query.filter || {};
  if(!RoutesACL.can("albums:drafts:list",req)) where.status = "public";
  albums.where(where);
  
  if(req.query.sort) albums.sort(req.query.sort);
  
  res.json(await albums);
});

routes.get("albums:recent","/recent", {permission: "albums:list"}).handle(async (req,res) => {
  
  var albums = Album.find({status:"public"}).sort("-datePublished").populate("titlePhotos");
  
  albums.limit(req.query.limit ? Math.min(10,req.query.limit) : 5);
  
  res.json(await albums);
});

// GET ALBUM BY ID
routes.get("album","/:id", {permission: "albums:read"}).handle(async (req,res,next) => {
  
  var query = Album.findOne({_id: req.params.id})
  
  if(req.query.event) query.populate("event","_id name dateFrom dateTill");
  if(req.query.photos) query.populate("photos");
  if(req.query.titlePhoto) query.populate("titlePhoto");
  if(req.query.titlePhotos) query.populate("titlePhotos");
  
  const album = await query;
  
  req.routes.links(album,"album");
  
  res.json(album)
});

// UPDATE ALBUM AT ID
routes.patch("album","/:id", {permission: "albums:edit"}).handle(async (req,res,next) => {
  await Album.findOneAndUpdate({_id: req.params.id},req.body);
  res.sendStatus(204);
});

/// DELETE ALBUM BY ID
routes.delete("album","/:id", {permission: "albums:delete"}).handle(async (req,res,next) => {

  const album = await Album.findOne({_id:req.params.id});

  await rmfr(config.photos.storageDir(album._id));
  await rmfr(config.photos.thumbsDir(album._id));
  
  await Album.deleteOne({_id: req.params.id});
  
  res.sendStatus(204);
});

routes.get("album:photos","/:id/photos", {permission:"albums:read"}).handle(async (req,res,next) => {
  
  let select = {
    "status": 1,
    "photos": req.query.limit ? { $slice: Number(req.query.limit) } : 1
  };
  
  let album = await Album.findOne({_id:req.params.id},select).populate("photos");
  
  if(!album) return res.sendStatus(404);
  if(album.status === "draft" && !RoutesACL.can("albums:drafts:read",req)) return res.sendStatus(401);
  
  res.json(album.photos);
});