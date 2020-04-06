const fs = require("fs-extra");
const config = require("./config");


const dirs = [
  config.storage.config,
  config.storage.events,
  config.storage.photos,
  config.storage.thumbs,
  config.storage.uploads,
];

async function ensureDirs() {
  for (let dir of dirs) {
    await fs.ensureDir(dir)
      .then(() => console.log("[FS] Initialized dir: " + dir))
      .catch(() => console.error("[FS] Failed to initialize dir: " + dir));
  }
}

module.exports = {
  ensureDirs
}