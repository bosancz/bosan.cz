const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

var moment = require("moment");

var config = require("../../config");

var createPage = require("./share/create-page");
var Album = require("../models/album");
var Photo = require("../models/photo");

routes.get(null,"/fotogalerie/:album",{permission:"gallery:read"}).handle(async (req,res) => {
  
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

routes.get(null, "/fotogalerie/:album/:photo",{permission:"gallery:read"}).handle(async (req,res) => {
  
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

routes.get(null, "**", {permission:"webinfo:read"}).handle((req,res) => {
  
  var options = {
    url: config.url,
    title: config.title,
    description: config.description,
    type: "website"
  };
  
  res.type("html").send(createPage(options));
});