var config = require("./config");

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

function connectDB() {

  console.log("[DB] Connecting to DB...");

  return mongoose.connect(config.database.uri, { useNewUrlParser: true })
    .then(() => console.log("[DB] Connected to " + config.database.uri))
    .catch(err => {
      throw new Error("Error when connectiong to " + config.database.uri + ": " + err.message);      
    });

}

/* MODELS */

require("./models");

module.exports = {
  connectDB,
  mongoose
}