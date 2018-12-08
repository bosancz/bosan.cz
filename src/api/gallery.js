const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

const config = require("../../config");

const Album = require("../models/album");
const Photo = require("../models/photo");

routes.get("gallery","/",{permission:"gallery:list"}).handle(async (req,res) => {
  res.json(await Album.find({status:"public"}));
});

routes.get("gallery:recent","/recent",{permission:"gallery:list"}).handle(async (req,res) => {
  
  var albums = Album.find({status:"public"}).sort("-datePublished").populate("titlePhotos");
  albums.limit(req.query.limit ? Math.min(10,req.query.limit) : 5);
  
  albums = req.routes.links(albums,"album");
  
  res.json(await albums);
});

routes.get("gallery:album","/:id",{permission:"gallery:read"}).handle(async (req,res) => {
  
  var album = await Album.findOne({_id:req.params.id,status:"public"});
  req.routes.links(album,"album");
  res.json(album);
});