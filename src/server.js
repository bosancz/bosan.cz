var express = require("express");
var app = express();

/* EXPRESS CONFIG */
app.set('json spaces', 2);

/* POLYFILLS */

// polyfill before express allows for async middleware
require('express-async-errors');

/* CONFIG */
var config = require("../config");

/* CORS for development */
if(config.server.cors){
  app.use(require("cors")({
    origin: /localhost/,
    credentials: true,
    methods: "GET,PUT,POST,PATCH,DELETE",
    allowedHeaders: ["Content-type","Set-Cookie"]
  }));
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


/* AUTHENTICATION AND ACL */

// setup jwt token parsing and validation
var jwt = require('express-jwt');
app.use(jwt(config.auth.jwt));

// connect to database
const mongoose = require("./db");

const { Routes } = require("@smallhillcz/routesjs");
Routes.setACL(config.acl);

/* ROUTING */

// router
var router = require("./router");
app.use(router);

if(config.mongoExpress.enabled){
  try{
    var mongoExpress = require('mongo-express/lib/middleware')
    var mongoExpressConfig = require("../config/mongo_express_config");
    app.use(config.mongoExpress.url, mongoExpress(mongoExpressConfig))
  }
  catch(e){ console.error("MongoExpress Error:",e); }
}

var errorHandler = require("./error-handler");
app.use(errorHandler);

/* SET UP SERVER */
let host = config.server.host;
let port = config.server.port;

var http = require("http");

http.createServer(app).listen(port, host, function () {
  console.log('Listening on ' + host + ':' + port + '!');
  process.send('ready');
});

/* GRACEFUL RELOAD */
process.on('SIGINT', function() {
   mongoose.disconnect(function(err) {
     process.exit(err ? 1 : 0);
   });
});