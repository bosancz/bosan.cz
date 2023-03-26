const path = require("path");

const dataDir = process.env.STORAGE || path.join(__dirname, "../../../", "data");

module.exports = {
  config: process.env.STORAGE_CONFIG || path.resolve(dataDir, "config"),
  uploads: process.env.STORAGE_UPLOADS || path.join(dataDir, "uploads"),
  photos: process.env.STORAGE_PHOTOS || path.join(dataDir, "photos"),
  thumbs: process.env.STORAGE_THUMBS || path.join(dataDir, "thumbs"),
  events: process.env.STORAGE_EVENTS || path.join(dataDir, "events"),
}