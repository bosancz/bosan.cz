const { writeFileSync } = require("fs");
const { join } = require("path");

const version = process.env.VERSION || "DEV";
const versionFilePath = join(__dirname, "..", "src", "version.ts");

writeFileSync(versionFilePath, `export const APP_VERSION = ${JSON.stringify(version)};\n`);

console.log(`Version set to ${version}`);
