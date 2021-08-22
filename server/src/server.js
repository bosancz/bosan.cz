import http from "http";
import errorHandler from "./error-handler.js";
import router from "./router.js";
import { Routes } from "@smallhillcz/routesjs";
import { ensureDirs } from "./file-storage.js";
import { connectDB } from "./db.js";
import { DateTime } from "luxon";
import jwt from "express-jwt";
import compression from "compression";
import express from "express";
import "express-async-errors"; // polyfill before express allows for async middleware
import QueryGuessTypesMiddleware from "./middleware/query-guess-types.js";

var app = express();

async function init() {
  /* EXPRESS CONFIG */
  app.set("json spaces", 2);

  /* CONFIG */
  const config = await import("./config/index.js");

  /* GZIP */
  app.use(compression());

  /* CORS */
  if (config.server.cors.enable === "true") {
    const cors = await import("cors");

    app.use(
      cors({
        origin: config.server.cors.origins ? config.server.cors.origins.split(",") : true,
        methods: ["OPTIONS", "HEAD", "GET", "POST", "PUT", "PATCH", "DELETE"],
        exposedHeaders: ["Location"],
        credentials: true,
      })
    );

    console.log(`[SERVER] CORS set up for ${config.server.cors.origins || "all origins"}`);
  }

  /* REQUEST PARSING */
  {
    const { json, urlencoded } = import("body-parser");
    app.use(json({ limit: config.uploads.limit })); // support json encoded bodies
    app.use(urlencoded({ extended: true, limit: config.uploads.limit })); // support urlencoded bodies

    const cookieParser = import("cookie-parser");
    app.use(cookieParser());

    // guess types like numbers, nulls and booleans
    app.use(QueryGuessTypesMiddleware);
  }

  /* LOCALE */
  DateTime.defaultLocale = "cs-CZ";

  /* DATABASE */
  connectDB();

  /* FILE DATA */
  await ensureDirs();

  /* AUTHENTICATION */
  app.use(jwt(config.auth.jwt), (err, req, res, next) => (err.code === "invalid_token" ? next() : next(err)));

  /* ACL */
  Routes.setACL(config.acl);

  /* ROUTING */
  app.use(config.server.baseDir, router);

  /* ERROR HANDLER */

  app.use(errorHandler);

  /* SERVER */
  let host = config.server.host;
  let port = config.server.port;

  http.createServer(app).listen(port, host, function () {
    console.log("[SERVER] Listening on http://" + host + ":" + port + " !");
  });
}

init().catch((err) => {
  console.error("Server start failed with error:", err.message);
  throw err;
});
