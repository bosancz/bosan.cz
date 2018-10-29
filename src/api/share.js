var express = require("express");
var router = module.exports = express.Router()

var moment = require("moment");

var acl = require("express-dynacl");

var config = require("../../config");

var Album = require("../models/album");
var Photo = require("../models/photo");

function getRoot(req){
  return req.protocol + "://" + req.hostname;
}

function createPage(options){
  var image = "";
  if(options.image){
    image = `
    <meta property="og:image" content="${options.image.url}" />
    <meta property="og:image:width" content="${options.image.width}" />
    <meta property="og:image:height" content="${options.image.height}" />`;
  }
  
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta property="fb:app_id" content="${config.facebook.app_id}" />
    <meta property="og:url" content="${options.url}" />
    <meta property="og:type" content="${options.type}" />
    <meta property="og:title" content="${options.title}" />
    <meta property="og:description" content="${options.description}" />
    ${image}
  </head>
  <body></body>
</html>
`;
}

router.get("/fotogalerie/:album", acl("albums:read"), async (req,res) => {
  
  var album = await Album.findOne({_id:req.params.album}).populate("titlePhotos");
  
  var options = {
    url: `${config.url}/fotogalerie/${req.params.album}`,
    title: album.name + " (" + moment(album.dateFrom).format('l') + " - " + moment(album.dateTill).format('l') + ")",
    description: album.description,
    type: "image.gallery",
    image: {
      url: album.titlePhotos && album.titlePhotos[0] ? album.titlePhotos[0].sizes.big.url : "",
      width: album.titlePhotos && album.titlePhotos[0] ? album.titlePhotos[0].sizes.big.width : "",
      height: album.titlePhotos && album.titlePhotos[0] ? album.titlePhotos[0].sizes.big.height : ""
    }
  }
  
  res.type("html").send(createPage(options));
});

router.get("/fotogalerie/:album/:photo", acl("albums:read"), async (req,res) => {
  
  var album = await Album.findOne({_id:req.params.album});
  var photo = await Photo.findOne({_id:req.params.photo});
  
  var options = {
    url: `${config.url}/fotogalerie/${req.params.album}/${req.params.photo}`,
    title: album.name + " (" + moment(album.dateFrom).format('l') + " - " + moment(album.dateTill).format('l') + ")",
    description: photo.caption || album.description,
    type: "image.gallery",
    image: {
      url: photo.sizes.big.url,
      width: photo.sizes.big.width,
      height: photo.sizes.big.height
    }
  }
  
  res.type("html").send(createPage(options));
});

router.get("**", (req,res) => {
  
  var options = {
    url: config.url,
    title: config.title,
    description: config.description,
    type: "website"
  };
  
  res.type("html").send(createPage(options));
});