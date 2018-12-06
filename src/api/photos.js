const config = require("../../config");

const { Routes } = require("../../lib/routes");
const routes = new Routes({url:config.api.root + "/payments"});
module.exports = routes.router;

var acl = require("express-dynacl");

var multer = require("multer");
var upload = multer({ dest: config.uploads.dir })

var rmfr = require("rmfr");
var path = require("path");

var Album = require("../models/album");
var Photo = require("../models/photo");

var savePhoto = require("./albums/photo-save");

// LIST ALBUMS
routes.get("photos","/").handle(acl("photos:list"), async (req,res,next) => {

  var query = Photo.find({});

  if(req.query.tag) query.where("tags",req.query.tag);
  if(req.query.albums) query.populate("album","_id name");
  if(req.query.sort) query.sort(req.query.sort);

  query.limit(req.query.limit ? Math.min(req.query.limit,100) : 100);

  res.json(await query);
});

// POST A PHOTO TO AN ALBUM
routes.post("photos","/").handle(acl("photos:create"), acl("albums:edit"), upload.single("photo"), async (req,res,next) => {

  // if file missing we send 400
  if(!req.file) return res.status(400).send("No photo");
  if(!req.body.album) return res.status(400).send("No album id");

  var tags = typeof req.body.tags === "string" ? req.body.tags.split(",") : req.body.tags;
  
  tags = tags.filter(tag => !!tag);
  
  // check if allowed type of file
  if(config.photos.allowedTypes.indexOf(req.file.originalname.split(".").pop().toLowerCase()) === -1) return res.status(400).send("Wrong file format. Allowed: " + config.photos.allowedTypes.join(", "));

  // find the album for the photo, if non existent, return 404
  var album = await Album.findOne({ _id: req.body.album });
  if(!album) return res.status(404).send("Album does not exist.");

  var photoData = {
    path: req.file.path,
    name: req.file.originalname,
    album: String(album._id),
    fields: {
      tags: tags || []
    }
  };
  
  var photo = await savePhoto(photoData);
  
  /* SAVE TO ALBUM */

  album.photos.push(photo._id);

  // if album has no titlephoto, then set it to this picture
  if(album.titlePhotos && !album.titlePhotos.length < 3) album.titlePhotos.push(photo._id);
  if(!album.titlePhotos) album.titlePhotos = [photo._id];
  
  // save the album
  await album.save()

  /* HAPPYEND */
  res.status(201).json(photo);

});

routes.get("photo", "/:photo").handle(acl("photos:read"), async (req,res) => res.json(await Photo.findOne({_id:req.params.photo})));

routes.patch("photo", "/:photo").handle(acl("photos:edit"), async (req,res) => {
  await Photo.findOneAndUpdate({_id:req.params.photo},req.body);
  res.sendStatus(204);
});

routes.delete("photo", "/:photo").handle(acl("photos:delete"), async (req,res,next) => {
  
  var photo = await Photo.findOne({_id:req.params.photo});
  if(!photo) return res.status(404).send("Photo not found.");
  
  var album = await Album.findOne({_id:photo.album});
  
  if(album){
    album.photos = album.photos.filter(item => String(item) !== String(photo._id));
    album.titlePhotos = album.titlePhotos.filter(item => String(item) !== String(photo._id));
    await album.save();
  }
  
  const storageDir = config.photos.storageDir(photo.album);
  const thumbsDir = config.photos.thumbsDir(photo.album);
  
  await rmfr(path.join(storageDir,photo.sizes.original.file))
  await rmfr(path.join(thumbsDir,photo.sizes.big.file))
  await rmfr(path.join(thumbsDir,photo.sizes.small.file))
  
  await Photo.deleteOne({_id:req.params.photo});
  
  res.sendStatus(204);
  
});