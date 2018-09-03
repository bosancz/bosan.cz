var environment = (process.env.NODE_ENV || "development");

console.log("Loading " + environment + " config.");
module.exports = require("./config." + environment + ".js");