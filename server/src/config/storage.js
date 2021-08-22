import path from "path";

const __dirname = path.resolve();

const dataDir = process.env.STORAGE || path.join(__dirname, "../../../", "data");

export default {
  config: process.env.STORAGE_CONFIG || path.resolve(dataDir, "config"),
  uploads: process.env.STORAGE_UPLOADS || path.join(dataDir, "uploads"),
  photos: process.env.STORAGE_PHOTOS || path.join(dataDir, "photos"),
  thumbs: process.env.STORAGE_THUMBS || path.join(dataDir, "thumbs"),
  events: process.env.STORAGE_EVENTS || path.join(dataDir, "events"),
};
