var fs = require("fs");
var path = require("path");
var rimraf = require("rimraf");
var mongoose = require("mongoose");

var config = require("../../config");

var connection = require("../db");

var Album = require("../models/album");
var Photo = require("../models/photo");

async function deleteGallery(){
  console.log("Deleting database collections");

  await Album.collection.drop().catch(err => console.error("Error: " + err.message));
  await Photo.collection.drop().catch(err => console.error("Error: " + err.message));
  
  console.log("Purging folders");
  await new Promise((resolve,reject) => rimraf(path.join(__dirname,"../../data/photos/*"),err => err ? reject(err) : resolve()));
  await new Promise((resolve,reject) => rimraf(path.join(__dirname,"../../data/photos_original/*"),err => err ? reject(err) : resolve()));
  
  console.log("Finished");
}

Promise.resolve()
  .then(() => connection)
  .then(() => deleteGallery())
  .then(() => process.exit())
  .catch(err => console.error(err));