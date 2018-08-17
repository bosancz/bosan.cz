var express = require("express");
var router = module.exports = express.Router();

var config = require("../../config");

var acl = require("express-dynacl");

var multer = require("multer");
var upload = multer({ dest: config.uploads.dir })

var rimraf = require("rimraf");
var mv = require("mv");
var path = require("path");

var Album = require("../models/album");
var Photo = require("../models/photo");

var savePhoto = require("./albums/photo-save");

// LIST ALBUMS
router.get("/", acl("photos:list"), async (req,res,next) => {

  var query = Photo.find({});

  if(req.query.tag) query.where("tags",req.query.tag);
  if(req.query.albums) query.populate("album","_id name");
  if(req.query.sort) query.sort(req.query.sort);

  query.limit(req.query.limit ? Math.min(req.query.limit,100) : 100);

  res.json(await query);
});

router.get("/tags", acl("photos:tags:list"), async (req,res,next) => {
  var tags = await Photo.distinct("tags");
  res.json(tags.filter(item => item != null));
});

// POST A PHOTO TO AN ALBUM
router.post("/", acl("albums:ids:create"), upload.single("photo"), async (req,res,next) => {

  // if file missing we send 400
  if(!req.file) return res.status(400).send("No photo");
  if(!req.body.album) return res.status(400).send("No album id");

  // check if allowed type of file
  if(config.photos.allowedTypes.indexOf(req.file.originalname.split(".").pop().toLowerCase()) === -1) return res.status(400).send("Wrong file format. Allowed: " + config.photos.allowedTypes.join(", "));

  // find the album for the photo, if non existent, return 404
  var album = await Album.findOne({ _id: req.body.album });
  if(!album) return res.status(404).send("Album does not exist.");

  var photo = await savePhoto({path: req.file.path, name: req.file.originalname, album: String(album._id)});
  
  /* SAVE TO ALBUM */

  album.photos.push(photo._id);

  // if album has no titlephoto, then set it to this picture
  if(!album.titlePhoto) album.titlePhoto = photo._id;
  // save the album
  await album.save()

  /* HAPPYEND */
  res.status(201).json(photo);

});

router.patch("/:id", acl("albums:ids:edit"), async (req,res) => {
  await Photo.findOneAndUpdate({_id:req.params.id},req.body);
  res.sendStatus(204);
});

router.delete("/:id", acl("albums:ids:delete"), async (req,res,next) => {
  
  var album = await Album.findOne({_id:req.params.album});
  if(!album) return res.status(404).send("Album not found.");
  
  var photo = await Photo.findOne({_id:req.params.photo, album:album._id});
  if(!photo) return res.status(404).send("Photo not found.");
  
  album.photos = album.photos.filter(item => String(item) !== String(photo._id));
  if(String(album.titlePhoto) === String(photo._id)) album.titlePhoto = album.photos.filter(item => String(item) !== String(photo._id))[0];    
  
  await album.save();
  
  rimraf(path.join(config.photos.storageDir,String(photo.album),photo.sizes.original.file),() => {})
  rimraf(path.join(config.photos.thumbsDir,String(photo.album),photo.sizes.big.file),() => {})
  rimraf(path.join(config.photos.thumbsDir,String(photo.album),photo.sizes.small.file),() => {})
  
  await Photo.deleteOne({_id:id._id,album:album._id})
  
  res.sendStatus(204);
  
});