var express = require("express");
var app = express();
var compression = require('compression');

async function init() {

  /* EXPRESS CONFIG */
  app.set('json spaces', 2);

  /* POLYFILLS */
  require('express-async-errors'); // polyfill before express allows for async middleware

  /* CONFIG */
  var config = require("./config");

  /* GZIP */
  app.use(compression());


  /* CORS */
  if (config.server.cors.enable === "true") {

    const cors = require("cors");

    app.use(cors({
      origin: config.server.cors.origins ? config.server.cors.origins.split(",") : true,
      methods: ["OPTIONS", "HEAD", "GET", "POST", "PUT", "PATCH", "DELETE"],
      exposedHeaders: ["Location"],
      credentials: true
    }));

    console.log(`[SERVER] CORS set up for ${config.server.cors.origins || 'all origins'}`);

  }

  /* REQUEST PARSING */
  {
    const { json, urlencoded } = require("body-parser");
    app.use(json({ limit: config.uploads.limit })); // support json encoded bodies
    app.use(urlencoded({ extended: true, limit: config.uploads.limit })); // support urlencoded bodies

    const cookieParser = require("cookie-parser");
    app.use(cookieParser());

    // guess types like numbers, nulls and booleans
    app.use(require("./middleware/query-guess-types.js"));
  }

  /* LOCALE */
  const { DateTime } = require("luxon");
  DateTime.defaultLocale = "cs-CZ";

  /* DATABASE */
  const { connectDB } = require("./db");
  connectDB();

  /* FILE DATA */
  const { ensureDirs } = require("./file-storage");
  await ensureDirs();

  /* AUTHENTICATION */
  var jwt = require('express-jwt');
  app.use(jwt(config.auth.jwt), (err, req, res, next) => (err.code === 'invalid_token') ? next() : next(err));

  /* ACL */
  const { Routes } = require("@smallhillcz/routesjs");
  Routes.setACL(config.acl);

  /* ROUTING */
  var router = require("./router");
  app.use(config.server.baseDir, router);

  /* ERROR HANDLER */
  var errorHandler = require("./error-handler");
  app.use(errorHandler);

  /* SERVER */
  let host = config.server.host;
  let port = config.server.port;

  var http = require("http");

  http.createServer(app).listen(port, host, function () {
    console.log('[SERVER] Listening on http://' + host + ':' + port + ' !');
  });

}

init()
  .catch(err => {
    console.error("Server start failed with error:", err.message);
    throw err;
  })