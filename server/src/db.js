import * as config from "./config/index.js";

import mongoose from "mongoose";

import mongooseAutopopulatePlugin from "mongoose-autopopulate";
import mongooseToObjectPlugin from "./plugins/mongoose-to-object.js";
import mongoosePaginatePlugin from "./plugins/mongoose-paginate.js";
import { RoutesPluginsMongoose } from "@smallhillcz/routesjs/lib/plugins/mongoose.js";

/* MODELS */
import "./models/index.js";

/* PLUGINS */
mongoose.plugin(mongooseAutopopulatePlugin);

mongoose.plugin(mongooseToObjectPlugin);

mongoose.plugin(mongoosePaginatePlugin);

mongoose.plugin(RoutesPluginsMongoose);

/* SETTINGS */
mongoose.Promise = global.Promise;

/* CONNECTION */
var retries = 0;

export function connectDB(attempt) {
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
