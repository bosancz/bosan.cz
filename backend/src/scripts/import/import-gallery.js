var fs = require("fs-extra");
var path = require("path");
var mongoose = require("mongoose");
var iconv = require("iconv-lite");
var unserialize = require("phpunserialize");

var config = require("../../config");

var connection = require("../db");

var Album = require("../models/album");
var Photo = require("../models/photo");

var savePhoto = require("../api/albums/photo-save");

var sourceDir = "/root/albums";
var albumsFile = path.join(sourceDir,"albumdb.dat");

var thumbsDir = "/var/www/bosan.cz-server/data/photos";
var storageDir = "/var/www/bosan.cz-server/data/photos_original";

var albumIndex = {};

var encoding = "ISO-8859-2";

async function openSerialized(file){
  var buffer = await fs.readFile(file);
  
  var string = iconv.decode(buffer,encoding);
  
  return unserialize(string,true);
}

async function importGallery(){
  
  console.log("Starting import from " + sourceDir);
  
  console.log("Reading root album db at " + albumsFile);
  var albums = await openSerialized(albumsFile,"ISO-8859-2");
 
  console.log("============================");
  console.log("Starting import of " + albums.length + " albums");
  
  var count = 0;
  
  //for(const album of albums){
  for(var i = 0; i < albums.length; i++){
    
    console.log("---");
    console.log("Importing album " + (i + 1) + " of " + albums.length + ": " + albums[i] + "...");

    await importAlbum(albums[i]);
    
    count++;
  }
  
  console.log("============================");
  console.log("Finished! Imported " + count + " albums.");
}

async function importAlbum(dir){
  
  var albumSrc = await openSerialized(path.join(sourceDir,dir,"album.dat"),"win1250");
  
  console.log("Name: " + albumSrc.fields.title);
  
  var tags = [];
  
  while(albumSrc.fields.parentAlbumName && !albumSrc.fields.parentAlbumName.match(/^\d{4}$/)){
    
    tags.push(albumSrc.fields.title);
    
    console.log("Found parent album: " + albumSrc.fields.parentAlbumName)
    
    albumSrc = await openSerialized(path.join(sourceDir,albumSrc.fields.parentAlbumName,"album.dat"),"win1250");
    
    console.log("Name: " + albumSrc.fields.title);
    
  }
  
  var public = albumSrc.fields.perms.canRead.everybody;
  console.log(public ? "Public" : "Hidden");
  
  var album = await Album.findOne({srcId:albumSrc.fields.name});
  
  if(!album){

    let date = albumSrc.fields.creation_date ? new Date(albumSrc.fields.creation_date * 1000) : new Date();

    var albumData = {
      status: public ? "public" : "draft",
      name: albumSrc.fields.title,
      srcId: albumSrc.fields.name,
      year: date.getFullYear(),
      description: albumSrc.fields.description,
      datePublished: date,
      titlePhotos: [],
      photos: []
    }

    album = await Album.create(albumData);

    var albumStorageDirFn = path.join(storageDir,String(album._id));
    var albumThumbsDirFn = path.join(thumbsDir,String(album._id));

    await fs.ensureDir(albumStorageDirFn);
    await fs.ensureDir(albumThumbsDirFn);

    console.log("Album record created");
  }
  else{
    console.log("Album already exists.");
  }
  
  var photos = await openSerialized(path.join(sourceDir,dir,"photos.dat"),"win1250");
  
  if(!photos){
    console.log("No photos.")
    return;
  }
  
  console.log("Importing " + photos.length + " photos:");
  
  var dateFrom = album.dateFrom;
  var dateTill = album.dateTill;
  
  for(var i = 0; i < photos.length; i++){
    
    let photo = await importPhoto(photos[i],album,dir,tags)
    
    if(photo){
      album.photos.push(photo);

      if(photos[i].highlight) album.titlePhotos.push(photo);

      if(!dateFrom || photo.date < dateFrom) dateFrom = photo.date;
      if(!dateTill || photo.date > dateTill) dateTill = photo.date;
    }
  }
  
  var dateFromTitle = albumSrc.fields.title.match(/.+\(([123]?\d)\. ?([12]?\d)\. ?\- ?([123]?\d)\. ?([12]?\d)\. ?(\d{4})\)/);
  if(dateFromTitle){
    dateFrom = new Date(dateFromTitle[5],dateFromTitle[2]-1,dateFromTitle[1]);
    dateTill = new Date(dateFromTitle[5],dateFromTitle[4]-1,dateFromTitle[3]);
  }
  else{
    dateFromTitle = albumSrc.fields.title.match(/.+\(([123]?\d)\. ?\- ?([123]?\d)\. ?([12]?\d)\. ?(\d{4})\)/);
    if(dateFromTitle){
      dateFrom = new Date(dateFromTitle[4],dateFromTitle[3]-1,dateFromTitle[1]);
      dateTill = new Date(dateFromTitle[4],dateFromTitle[3]-1,dateFromTitle[2]);
    }
  }

  if(dateFrom && dateFrom.getFullYear() !== 2018) album.year = dateFrom.getFullYear();
  album.dateFrom = dateFrom;
  album.dateTill = dateTill;
  
  console.log("Inferred date: " + dateFrom + " - " + dateTill + " (" + album.year + ")");
  
  await album.save();
  
}

async function importPhoto(photoSrc,album,dir,tags){
  
  if(!photoSrc.image){
    console.log(" - empty photo, skipping...");
    return;
  }
  
  let fileName = photoSrc.image.name + "." + photoSrc.image.type;
  
  var photo = await Photo.findOne({album:album._id,name:fileName});
  
  if(!photo){
    let photoFile = path.join(sourceDir,dir,fileName)

    let options = {
      path: photoFile,
      name: fileName,
      tags: tags,
      album: String(album._id),
      copy: true,
      fields: {
        caption: photoSrc.caption
      }
    }
    
    var photo;
    
    try{
      photo = await savePhoto(options);
      console.log(" - " + fileName + " ... imported");
      return photo;
    }
    catch(e){
      
      options.path = path.join(sourceDir,dir,photoSrc.image.name + ".sized." + photoSrc.image.type);
      options.fields.fromSized = true;
      
      try{
        photo = await savePhoto(options);
        console.log(" - " + fileName + " ... error, imported from sized");
        return photo;
      }
      catch(e){
        console.log(" - " + fileName + " ... error");
        return;
      }
    }

  }

  console.log(" - " + fileName + " ... already exists");
  return null;
  
}


/* RUN, FOREST, RUN */
Promise.resolve()
  .then(() => connection)
  .then(() => importGallery())
  .then(() => mongoose.disconnect().then(() => console.log("DB disconnected")))
  .then(() => process.exit())
  .catch(err => {
    console.error("Error: " + err.name);
    console.error(err);
    process.exit(1);
  });