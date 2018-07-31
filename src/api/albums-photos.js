var express = require("express");
var router = module.exports = express.Router({mergeParams: true});

var mongoose = require("mongoose");

var acl = require("express-dynacl");
var multer = require("multer");
var upload = multer({ dest: 'data/uploads/' })

var rimraf = require("rimraf");
var mv = require("mv");
var path = require("path");

var config = require("../../config");

var Album = require("../models/album");
var Photo = require("../models/photo");

var photoResize = require("./albums/photo-resize");

// POST A PHOTO TO AN ALBUM
router.post("/", acl("albums:photos:create"), upload.single("photo"), async (req,res,next) => {

  // if file missing we send 400
  if(!req.file) return res.status(400).send("No photo");

  // check if allowed type of file
  if(config.photos.allowedTypes.indexOf(req.file.originalname.split(".").pop().toLowerCase()) === -1) return res.status(400).send("Wrong file format. Allowed: " + config.photos.allowedTypes.join(", "));

  // find the album for the photo, if non existent, return 404
  var album = await Album.findOne({ _id: req.params.album });
  if(!album) return res.status(404).send("Album does not exist.");

  // get file path parts
  var photoId = mongoose.Types.ObjectId();
  var albumId = String(album._id);
  var name = String(photoId);
  var ext = path.extname(req.file.originalname);
  var filepath = path.join(config.photos.storageDir,albumId,name + ext);
  
  // prepare the thumbs sizes array  
  var sizes = Object.entries(config.photos.sizes).map(size => ({
    width: size[1][0],
    height: size[1][1],
    name: size[0],
    path: path.join(config.photos.thumbsDir,String(album._id),name + "_" + size[0] + ext)
  }));

  try{
    
    await new Promise((resolve,reject) => mv(req.file.path,filepath,err => err ? reject(err) : resolve()));

    var info = await photoResize(filepath,sizes,true);

    // save photo data
    var photoData = {
      _id: photoId,
      album: album._id,
      name: req.file.originalname,
      date: info.stats.date || new Date(),
      bg: info.stats.bg,
      sizes: {
        original: { 
          width: info.stats.width, 
          height: info.stats.height, 
          file: name + ext
        }
      }
    };
    
    info.sizes.forEach(size => {
      photoData.sizes[size.name] = {
        width: size.width,
        height: size.height,
        file: photoId + "_" + size.name + ext
      };
    });

    // save the photo data
    var photo = await Photo.create(photoData);

    // add the photo to album
    album.photos.push(photo._id);
    // if album has no titlephoto, then set it to this picture
    if(!album.titlePhoto) album.titlePhoto = photo._id;
    // save the album
    await album.save()
    // save the photo, resize, save in DB
    
    res.status(201).json(photo);
  }
  catch(err) {
    rimraf(req.file.path,() => {});
    rimraf(filepath,() => {});
    Object.entries(sizes).forEach(size => rimraf(size[1].path,() => {}));
    next(err);
  }



});

router.delete("/:photo", acl("albums:photos:delete"), async (req,res,next) => {
  
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
  
  await Photo.deleteOne({_id:photo._id,album:album._id})
  
  res.sendStatus(204);
  
});