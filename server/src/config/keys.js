const fs = require("fs");
const path = require("path");

const keyDir = process.env.KEYS_DIR || path.resolve(__dirname + "/../../../keys/");

function loadKeyfile(file) {
  try {
    const filePath = path.join(keyDir, file);
    let rawdata = fs.readFileSync(filePath);
    return JSON.parse(rawdata);
  }
  catch (err) {
    console.log(`[KEYS] Missing keyfile ${file} in ${keyDir}`)
    return undefined;
  }

}
module.exports = {
  google: loadKeyfile("google.json"),
  vapid: loadKeyfile("vapid.json")
}