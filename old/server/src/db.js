var config = require("./config");

var mongoose = require("mongoose");

/* PLUGINS */
mongoose.plugin(require("mongoose-autopopulate"));

mongoose.plugin(require("./plugins/mongoose-to-object"));

mongoose.plugin(require("./plugins/mongoose-paginate"));

mongoose.plugin(require("@smallhillcz/routesjs/lib/plugins/mongoose").RoutesPluginsMongoose);

/* SETTINGS */
mongoose.Promise = global.Promise;

/* CONNECTION */
var retries = 0;

function connectDB(attempt) {
  if (!attempt) console.log("[DB] DB URI: " + config.database.uri);

  attempt = (attempt || 0) + 1;

  console.log(`[DB] Connecting to DB... attempt ${attempt}/${config.database.retryCount}`);

  mongoose
    .connect(config.database.uri, { useNewUrlParser: true })
    .then(() => console.log("[DB] Connected to " + config.database.uri))
    .catch((err) => {
      if (attempt <= config.database.retryCount) {
        console.error(`[DB] Error when connectiong to DB. Will retry in ${config.database.retryInterval / 1000}s.`);
        setTimeout(() => connectDB(attempt), config.database.retryInterval);
      } else {
        throw new Error("[DB] Error when connectiong to DB: " + err.message);
      }
    });
}

/* MODELS */

require("./models");

module.exports = {
  connectDB,
  mongoose,
};
