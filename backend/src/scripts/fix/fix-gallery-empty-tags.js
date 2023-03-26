var mongoose = require("mongoose");

var connection = require("../db");

var Photo = require("../models/photo");

const dry = false;

async function main(){
  const photos = await Photo.find().select("_id tags");

  console.log("Photos: " + photos.length);
  
  var counter = 0;
  
  for(var photo of photos){
    
    if(!photo.tags) continue;
    
    let before = photo.tags.length;

    photo.tags = photo.tags.filter(tag => !!tag);
    if(!dry) await photo.save();
    
    counter += before - photo.tags.length;
  }

  
  console.log("Tags filtered: " + counter);
}

/* RUN, FOREST, RUN */
Promise.resolve()
  .then(() => connection)
  .then(() => main())
  .then(() => mongoose.disconnect().then(() => console.log("DB disconnected")))
  .then(() => process.exit())
  .catch(err => {
  console.error("Error: " + err.name);
  console.error(err);
  process.exit(1);
});