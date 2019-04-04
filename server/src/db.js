var environment = require("../environment");
var config = require("../config");

var mongoose = require('mongoose');

/* PLUGINS */
mongoose.plugin(require("mongoose-autopopulate"));

mongoose.plugin(require("./plugins/mongoose-to-object"));

mongoose.plugin(require("./plugins/mongoose-paginate"));

mongoose.plugin(require("@smallhillcz/routesjs/lib/plugins/mongoose").RoutesPluginsMongoose);

/* SETTINGS */
mongoose.Promise = global.Promise;

/* CONNECTION */
var retries = 0;

function connect() {

  console.log("[DB] Connecting to DB...");

  mongoose.connect(environment.databaseUri, config.database)
    .then(() => console.log("[DB] Connected to " + environment.databaseUri))
    .catch(err => {
      console.error("[DB] Error when connectiong to " + environment.databaseUri + ": " + err.message); // if not connected the app will not throw any errors when accessing DB models, better to fail hard and fix

      retries++;
      if (retries <= 10) {
        console.error("[DB] Retrying in 10s...");
        setTimeout(() => connect(), 10000);
      }
      else {
        throw new Error("DB connection failed.");
      }
    });
}

connect();

/* MODELS */

require("./models"); // just load, so that we dont have to worry about missing schemas for references

module.exports = mongoose;