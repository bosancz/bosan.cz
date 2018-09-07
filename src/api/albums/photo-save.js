var rmfr = require("rmfr");
var mv = require("mv");
var cp = require("cp");
var path = require("path");
var fs = require("fs");

var mongoose = require("mongoose");

var config = require("../../../config");

var Album = require("../../models/album");
var Photo = require("../../models/photo");

var resizePhoto = require("./photo-resize");

module.exports = async function(options){
  
  var currentPath = options.path;
  var originalName = options.name;
  var albumId = options.album;
  var copy = options.copy;
  
  if(!currentPath) throw new Error("Missing currentPath");
  if(!originalName) throw new Error("Missing originalName");
  if(!albumId) throw new Error("Missing albumId");
  
  // get file path parts
  var photoId = mongoose.Types.ObjectId();
  var name = String(photoId);
  var ext = path.extname(originalName);
  
  var storageDir = path.join(config.photos.storageDir,albumId);
  var storagePath = path.join(storageDir,name + ext);
  var thumbsDir = path.join(config.photos.thumbsDir,albumId);

  try{

    /* CREATE DIRS */
    await new Promise((resolve,reject) => fs.mkdir(thumbsDir, err => (!err || err.code == 'EEXIST') ? resolve() : reject(err)));
    await new Promise((resolve,reject) => fs.mkdir(storageDir, err => (!err || err.code == 'EEXIST') ? resolve() : reject(err)));
    
    /* RESIZE */
    
    var sizes = Object.entries(config.photos.sizes).map(size => ({
      width: size[1][0],
      height: size[1][1],
      name: size[0],
      path: path.join(thumbsDir,name + "_" + size[0] + ext)
    }));

    var info = await resizePhoto(currentPath,sizes,{stats: true});

    
    /* MOVE THE PHOTO TO STORAGE */
    
    if(copy) await new Promise((resolve,reject) => cp(currentPath,storagePath,err => err ? reject(err) : resolve()));    
    else await new Promise((resolve,reject) => mv(currentPath,storagePath,err => err ? reject(err) : resolve()));   
    
    
    /* SAVE METADATA */
    
    var photoData = {
      _id: photoId,
      album: albumId,
      name: originalName,
      date: info.stats.date || new Date(),
      bg: info.stats.bg,
      sizes: {
        original: { 
          width: info.stats.width, 
          height: info.stats.height, 
          file: name + ext
        }
      },
      tags: options.tags || []
    };

    info.sizes.forEach(size => {
      photoData.sizes[size.name] = {
        width: size.width,
        height: size.height,
        file: photoId + "_" + size.name + ext
      };
    });
    
    if(options.fields) Object.entries(options.fields).forEach(entry => photoData[entry[0]] = entry[1]);

    var photo = await Photo.create(photoData);
 
    /* RETURN PHOTO */
    
    return photo;
  }
  catch(err) {    
    await rmfr(storagePath).catch(err => {});
    for(var size of Object.entries(sizes)) await rmfr(size[1].path).catch(err => {});
    throw err;
  }
}