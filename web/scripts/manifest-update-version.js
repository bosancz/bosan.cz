const { readFileSync, writeFileSync } = require("fs");

const packageJsonPath = "../package.json";
const manifestJsonPath = "./dist/manifest.json";

const packageJson = JSON.parse(readFileSync(packageJsonPath));
const manifestJson = JSON.parse(readFileSync(manifestJsonPath));

manifestJson.name = manifestJson.short_name + " v" + packageJson.version;

writeFileSync(manifestJsonPath, JSON.stringify(manifestJson, undefined, 2));
