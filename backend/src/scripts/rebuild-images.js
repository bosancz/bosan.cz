var fs = require("fs-extra");
var path = require("path");
var mongoose = require("mongoose");

var config = require("../config");

var connection = require("../db");

var Photo = require("../models/photo");

const photoResize = require("../api/albums/photo-resize");

const dry = false;
const limit = 10;

async function init(){
  console.log("Storage dir:",storageDir);
  console.log("Thumbs dir:",thumbsDir);
}

async function getPhotos(){
  const query = Photo.find({});
  query.select("_id name album caption");
  query.lean();
  query.populate("album","name");
  if(limit) query.limit(limit);
  return query;
}

async function resizePhotos(photos){

  console.log(`\nResizing ${photos.length} photos...`);

  for(let photo of photos){    
    await resizePhoto(photo);
  }

  console.log("\nFinished");
}

async function resizePhoto(photo){

  console.log(`\nPhoto (original name: ${photo.name}, album: ${photo.album.name}, caption: ${photo.caption})`);


  const name = String(photo._id);
  const ext = path.extname(photo.name);

  const storageDir = config.photos.albumStorageDirFn(photo.album._id);
  const storagePath = path.join(storageDir,name + ext);

  console.log("Storage path: ",storagePath);

  const thumbsDir = config.photos.albumThumbsDirFn(photo.album._id);
  await fs.ensureDir(thumbsDir);

  const sizes = Object.entries(config.photos.sizes).map(size => ({
    width: size[1][0],
    height: size[1][1],
    name: size[0],
    path: path.join(thumbsDir,name + "_" + size[0] + ext)
  }));


  process.stdout.write((dry ? "(DRY) " : "") + "Deleting old sizes...\r");
  if(!dry) for(var size of sizes) await fs.remove(size.path).catch(err => {});      
  process.stdout.write((dry ? "(DRY) " : "") + "Deleting old sizes... OK\r\n");
  
  process.stdout.write((dry ? "(DRY) " : "") + "Creating new sizes...\r");
  if(!dry) await photoResize(storagePath,sizes);
  process.stdout.write((dry ? "(DRY) " : "") + "Creating new sizes... OK\r\n");
  
}

/* RUN, FOREST, RUN */
Promise.resolve()
  .then(() => connection)
  .then(() => getPhotos())
  .then(photos => resizePhotos(photos))
  .then(() => mongoose.disconnect().then(() => console.log("DB disconnected")))
  .then(() => process.exit())
  .catch(err => {
  console.error("Error: " + err.name);
  console.error(err);
  process.exit(1);
});