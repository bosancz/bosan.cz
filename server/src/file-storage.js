const fs = require("fs-extra");
const config = require("../config");
const environment = require("../environment");

async function ensureDirs() {
  await fs.ensureDir(config.events.storageDir);
  await fs.ensureDir(config.photos.storageDir);
  await fs.ensureDir(config.photos.thumbsDir);
}

ensureDirs()
  .then(() => console.log("File storage initialized to " + environment.data.root))
  .catch(err => {
    console.error(`Failed to initialize file storage to ${environment.data.root}. Error: ${err.message}`);
    process.exit(1);
  })

