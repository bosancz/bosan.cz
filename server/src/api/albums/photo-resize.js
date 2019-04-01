var fs = require("fs");
var path = require("path");

var rimraf = require("rimraf");

var sharp = require("sharp");
var exif = require('exif-reader');

module.exports = async function(file,sizes,options){
  
  var stats = options ? options.stats : false;

  var result = {};

  /* PHOTO STATISTICS */
  if(stats){
    var metadata = await Promise.all([
      sharp(file).metadata(),
      sharp(file).stats()
    ]);
    
    var origExif = metadata[0].exif ? exif(metadata[0].exif) : null;

    result.stats = {
      date: (origExif && origExif.exif && origExif.exif.DateTimeOriginal) || (origExif && origExif.image && origExif.image.ModifyDate),
      bg: "rgb(" + metadata[1].channels.slice(0,3).map(channel => Math.round(channel.mean)).join(",") + ")",
      width: metadata[0].width,
      height: metadata[0].height
    };
  }

  if(sizes){

    // generate smaller versions of the file    
    var sizesMetadata = await Promise.all(sizes.map(size => sharp(file).resize(size.width,size.height).max().withMetadata().toFile(size.path)));

    result.sizes = sizes.map((size,i) => ({
      width: sizesMetadata[i].width,
      height: sizesMetadata[i].height,
      size: sizesMetadata[i].size,
      name: size.name
    }));

  }

  return result;

}