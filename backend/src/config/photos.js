const path = require("path");

const storage = require("./storage");

module.exports = {

  albumStorageDirFn: albumId => path.join(storage.photos, String(albumId)),
  albumThumbsDirFn: albumId => path.join(storage.thumbs, String(albumId)),

  allowedTypes: ["jpg", "jpeg", "png", "gif"],

  sizes: {
    "big": [1280, 1024],
    "small": [1024, 340]
  }
}