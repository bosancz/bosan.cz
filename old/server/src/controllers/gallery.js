const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

const config = require("../config");

const Album = require("../models/album");
const Photo = require("../models/photo");

const albumDownload = require("./albums/album-download");

routes.get("gallery", "/", { permission: "gallery:list" }).handle(async (req, res) => {
  const query = Album.find({ status: "public" });
  if (req.query.sort) query.sort(req.query.sort);
  res.json(await query);
});

routes.get("gallery:recent", "/recent", { permission: "gallery:list" }).handle(async (req, res) => {

  var query = Album.find({ status: "public" }).sort("-datePublished").limit(req.query.limit ? Math.min(10, req.query.limit) : 5);
  query.populate("titlePhotos");
  query.populate({ path: "photos", options: { limit: 3 } });

  const albums = await query.then(docs => docs.map(doc => doc.toObject()));

  // fill in missing titlePhotos
  for (let album of albums) {
    if (!album.titlePhotos) album.titlePhotos = [];
    if (album.titlePhotos.length < 3) album.titlePhotos.push(...album.photos.slice(0, 3 - album.titlePhotos.length));
  }

  req.routes.links(albums, "galleryalbum");

  res.json(albums);
});

routes.get("galleryalbum", "/:id", { permission: "gallery:read" }).handle(async (req, res) => {
  var query = Album.findOne({ _id: req.params.id, status: "public" });
  query.populate("titlePhotos");
  query.populate("photos");

  const album = await query.toObject();
  if (!album) return res.sendStatus(404);

  // fill in missing titlePhotos
  if (!album.titlePhotos) album.titlePhotos = [];

  let i = 0;
  while (album.titlePhotos.length < 3 && album.photos[i]) {
    if (!album.titlePhotos.some(item => String(item._id) === String(album.photos[i]._id))) album.titlePhotos.push(album.photos[i]);
    i++;
  }

  req.routes.links(album, "galleryalbum");

  res.json(await album);
});

routes.get("galleryalbum:preview", "/:id", { permission: "gallery:read" }).handle(async (req, res) => {
  var query = Album.findOne({ _id: req.params.id, status: "public" }).select("name dateFrom dateTill description")
  query.populate({ path: "titlePhotos", options: { limit: 3 } });
  query.populate({ path: "photos", options: { limit: 3 } });

  const album = await query.then(doc => doc.toObject());

  // fill in missing titlePhotos
  if (!album.titlePhotos) album.titlePhotos = [];
  if (album.titlePhotos.length < 3) album.titlePhotos.push(...album.photos.slice(0, 3 - album.titlePhotos.length));

  req.routes.links(album, "galleryalbum");

  res.json(await album);
});

routes.get("galleryalbum:download", "/:id/download", { permission: "gallery:download" }).handle(async (req, res) => {

  var album = await Album.findOne({ _id: req.params.id, status: "public" });

  if (!album) return res.sendStatus(404);

  res.writeHead(200, {
    'Content-Type': 'application/zip',
    'Content-disposition': 'attachment; filename=album.zip'
  });

  albumDownload(album._id, res)
    .catch(err => {
      console.log(err.message);
    });
});