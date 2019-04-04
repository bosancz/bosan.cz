var mongoose = require("mongoose");

var connection = require("../db");

var Album = require("../models/album");

var dry = false;

async function fixTitlePhotos(){
  var albums = await Album.find().select("_id name year photos titlePhotos");
  
  for(var album of albums){
    
    console.log("=== ALBUM: " + album.name + " " + album.year);
    
    if(!album.titlePhotos) album.titlePhotos = [];
    
    var photos = album.photos.slice();
    
    console.log("Prev: " + album.titlePhotos.join(", "));

    if(album.titlePhotos.length < 3){
      while(photos.length && album.titlePhotos.length < 3){
        let photo = photos.shift();

        if(album.titlePhotos.indexOf(photo) === -1){
          album.titlePhotos.push(photo);
        }
      }

      if(!dry){
        await album.save();
        console.log("Saved.");
      }
    }
    
    console.log("Curr: " + album.titlePhotos.join(", "));
  }
}

/* RUN, FOREST, RUN */
Promise.resolve()
  .then(() => connection)
  .then(() => fixTitlePhotos())
  .then(() => mongoose.disconnect().then(() => console.log("DB disconnected")))
  .then(() => process.exit())
  .catch(err => {
  console.error("Error: " + err.name);
  console.error(err);
  process.exit(1);
});