var express = require("express");
var router = module.exports = express.Router()

var moment = require("moment");

var acl = require("express-dynacl");

var config = require("../../config/config");

var Album = require("../models/album");

function redirectUser(redirectUrlFn){
  return function(req,res,next){
    var ua = req.headers["user-agent"];
    if(/^(facebookexternalhit)|(Twitterbot)|(Pinterest)/gi.test(ua)){
      console.log("Bot found, serving static page");
      next();
    }
    else{
      let url = redirectUrlFn ? redirectUrlFn(req,res,next) : req.originalUrl.replace("api/share/","");
      res.redirect(301, url);
    }
  }
}

function createPage(options){
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta property="fb:app_id" content="${config.facebook.app_id}" />
    <meta property="og:url" content="${config.domain}${options.url}" />
    <meta property="og:type" content="${options.type}" />
    <meta property="og:title" content="${options.title}" />
    <meta property="og:description" content="${options.description}" />
    <meta property="og:image" content="${config.domain}${options.image.url}" />
    <meta property="og:image:width" content="${options.image.width}" />
    <meta property="og:image:height" content="${options.image.height}" />
  </head>
  <body></body>
</html>
`;
}

router.get("/fotogalerie/:album", redirectUser(), acl("albums:read"), async (req,res) => {
  
  var album = await Album.findOne({_id:req.params.album}).populate("titlePhotos");
  
  var options = {
    url: "/api/share/fotogalerie/" + album._id,
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