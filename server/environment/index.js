/* LOAD ENVIRONMENT CONFIG */
const environmentName = (process.env.NODE_ENV || "development");
console.log("Loading configuration for environment: " + environmentName);

try {
  module.exports = require("./environment." + environmentName + ".js");
}
catch (e) {  
  console.error(`Could not load environment file server/config/environment.${environmentName}.js. File is either missing or invalid.`);
  console.error(e.message);
  process.exit(1);
}