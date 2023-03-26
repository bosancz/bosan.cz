const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

const { DateTime } = require("luxon");

var config = require("../config");

var createPage = require("./share/create-page");
var Album = require("../models/album");
var Photo = require("../models/photo");

routes.get(null, "/fotogalerie/:album", { permission: "gallery:read" }).handle(async (req, res) => {

  const album = await Album.findOne({ _id: req.params.album }).populate("titlePhotos");

  const dateFrom = DateTime.fromJSDate(album.dateFrom).toFormat("d. M. y");
  const dateTill = DateTime.fromJSDate(album.dateFrom).toFormat("d. M. y");

  const options = {
    url: `${config.url}/fotogalerie/${req.params.album}`,
    title: album.name + " (" + (dateFrom === dateTill ? dateFrom : dateFrom + " - " + dateTill) + ")",
    description: album.description || "",
    type: "image.gallery",
    image: {
      url: album.titlePhotos && album.titlePhotos[0] ? album.titlePhotos[0].sizes.big.url : "",
      width: album.titlePhotos && album.titlePhotos[0] ? album.titlePhotos[0].sizes.big.width : "",
      height: album.titlePhotos && album.titlePhotos[0] ? album.titlePhotos[0].sizes.big.height : ""
    }
  }

  res.type("html").send(createPage(options));
});

routes.get(null, "/fotogalerie/:album/:photo", { permission: "gallery:read" }).handle(async (req, res) => {

  var album = await Album.findOne({ _id: req.params.album });
  var photo = await Photo.findOne({ _id: req.params.photo });

  if (!photo || !album) return res.sendStatus(404);

  const dateFrom = DateTime.fromJSDate(album.dateFrom).toFormat("d. M. y");
  const dateTill = DateTime.fromJSDate(album.dateFrom).toFormat("d. M. y");

  var options = {
    url: `${config.url}/fotogalerie/${req.params.album}/${req.params.photo}`,
    title: album.name + " (" + (dateFrom === dateTill ? dateFrom : dateFrom + " - " + dateTill) + ")",
    description: photo.caption || album.description || "",
    type: "image.gallery",
    image: {
      url: photo.sizes.big.url,
      width: photo.sizes.big.width,
      height: photo.sizes.big.height
    }
  }

  res.type("html").send(createPage(options));
});

routes.get(null, "/program", { permission: "webinfo:read" }).handle((req, res) => {

  var options = {
    url: `${config.url}/program`,
    title: "Program akcí :: " + config.general.title,
    description: "Podívejte se, jaké akce pro vás máme připraveny na příštích pár týdnů.",
    type: "website",
    image: config.general.image
  };

  res.type("html").send(createPage(options));
});

routes.get(null, "**", { permission: "webinfo:read" }).handle((req, res) => {

  var options = {
    url: config.general.url,
    title: config.general.title,
    description: config.general.description,
    type: "website",
    image: config.general.image
  };

  res.type("html").send(createPage(options));
});