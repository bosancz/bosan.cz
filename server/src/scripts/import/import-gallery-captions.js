import fs from "fs-extra";
import path from "path";
import mongoose from "mongoose";
import iconv from "iconv-lite";
import unserialize from "phpunserialize";

import config from "../../config";

import connection from "../db";

import Album from "../models/album";
import Photo from "../models/photo";

var sourceDir = "/root/albums";

var encoding = "ISO-8859-2";

async function openSerialized(file) {
  var buffer = await fs.readFile(file);

  var string = iconv.decode(buffer, encoding);

  return unserialize(string, true);
}

async function importCaptions() {
  var albums = await Album.find({});

  for (var album of albums) {
    console.log("Album: " + album.name);

    var photos = await openSerialized(path.join(sourceDir, album.srcId, "photos.dat"));

    for (var photo of photos) {
      if (!photo.image) {
        console.log(" - empty photo");
        continue;
      }

      let name = photo.image.name + "." + photo.image.type;

      console.log(" - photo: " + name + ", caption: " + photo.caption);

      await Photo.findOneAndUpdate({ album: album._id, name: name }, { caption: photo.caption });
    }
  }
}

/* RUN, FOREST, RUN */
Promise.resolve()
  .then(() => connection)
  .then(() => importCaptions())
  .then(() => mongoose.disconnect().then(() => console.log("DB disconnected")))
  .then(() => process.exit())
  .catch((err) => {
    console.error("Error: " + err.name);
    console.error(err);
    process.exit(1);
  });
