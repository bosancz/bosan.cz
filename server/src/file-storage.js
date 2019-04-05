const fs = require("fs-extra");
const path = require("path");
const config = require("../config");
const environment = require("../environment");

async function ensureDirs() {  
  await fs.ensureDir(environment.data.root);
  await fs.ensureDir(config.events.storageDir);
  await fs.ensureDir(config.photos.storageDir);
  await fs.ensureDir(config.photos.thumbsDir);
}

ensureDirs()
  .then(() => console.log("[FS] File storage initialized to " + path.resolve(environment.data.root)))
  .catch(err => {
    console.error(`[FS] Failed to initialize file storage to ${environment.data.root}. Error: ${err.message}`);
    process.exit(1);
  })

