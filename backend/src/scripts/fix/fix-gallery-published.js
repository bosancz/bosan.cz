var mongoose = require("mongoose");

var connection = require("../db");

var Album = require("../models/album");

Album
  .find({datePublished: {"$gte": new Date(2018, 7, 16), "$lt": new Date(2018, 7, 17)}})
  .select("_id datePublished dateTill")
  .then(albums => Promise.all(albums.map(album => {
      album.datePublished = album.dateTill;
      return album.save();
  })))
  .then(() => console.log("Finished"))
  .then(() => process.exit());