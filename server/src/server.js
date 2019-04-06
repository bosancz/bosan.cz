var express = require("express");
var app = express();
var fs = require("fs-extra");

/* EXPRESS CONFIG */
app.set('json spaces', 2);

/* POLYFILLS */
require('express-async-errors'); // polyfill before express allows for async middleware

/* CONFIG */
var config = require("../config");
var environment = require("../environment");
console.log(environment.data.root, config.config.storageDir);

/* CORS FOR DEVELOPMENT */
if(environment.cors){
  const cors = require("cors");
  app.use(cors(config.cors));  
  console.log("[SERVER] CORS enabled");
}

/* REQUEST PARSING */
const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit:'10mb' })); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true,  limit:'10mb' })); // support urlencoded bodies

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// guess types like numbers, nulls and booleans
app.use(require("./middleware/query-guess-types.js"));

/* LOCALE */
const { DateTime } = require("luxon");
DateTime.defaultLocale = "cs-CZ";

/* DATABASE */
const mongoose = require("./db");

/* FILE DATA */
require("./file-storage");

/* AUTHENTICATION */
var jwt = require('express-jwt');
app.use(jwt(config.jwt), (err, req, res, next) => (err.code === 'invalid_token') ? next() : next(err));

/* ACL */
const { Routes } = require("@smallhillcz/routesjs");
Routes.setACL(config.acl);

/* ROUTING */
var router = require("./router");
app.use(router);

/* ERROR HANDLER */
var errorHandler = require("./error-handler");
app.use(errorHandler);

/* SERVER */
let host = environment.server.host;
let port = environment.server.port;

var http = require("http");

http.createServer(app).listen(port, host, function () {
  console.log('[SERVER] Listening on http://' + host + ':' + port + ' !');
  if(process.send) process.send('ready');
});

/* GRACEFUL RELOAD */
process.on('SIGINT', function() {
   mongoose.disconnect(function(err) {
     process.exit(err ? 1 : 0);
   });
});