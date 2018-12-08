var express = require("express");
var app = express();

/* EXPRESS CONFIG */
app.set('json spaces', 2);

/* POLYFILLS */

// polyfill before express allows for async middleware
require('express-async-errors');


/* CONFIG */

var config = require("../config");


/* REQUEST PARSING */

var bodyParser = require("body-parser");
app.use(bodyParser.json({ limit:'10mb' })); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true,  limit:'10mb' })); // support urlencoded bodies

// guess types like numbers, nulls and booleans
app.use(require("./middleware/query-guess-types.js"));


/* LOCALE */

var moment = require("moment");
moment.locale("cs");


/* AUTHENTICATION AND ACL */

// setup jwt token parsing and validation
var jwt = require('express-jwt');
app.use(jwt(config.auth.jwt));

// connect to database
require("./db");

const { Routes } = require("@smallhillcz/routesjs");
Routes.setACL({
  permissions: require("../config/acl"),
  userRoles: req => req.user ? req.user.roles || [] : [],
  defaultRole: "guest",
  logConsole: true,
  logString: event => `ACL ${event.result ? "OK" : "XX"} | permission: ${event.permission}, user: ${event.req.user ? event.req.user._id : "-"}, roles: ${event.req.user ? event.req.user.roles.join(",") : "-"}, ip: ${event.req.headers['x-forwarded-for'] || event.req.connection.remoteAddress}`
});

/* ROUTING */

// router
var router = require("./router");
app.use(router);

if(config.mongoExpress.enabled){
  var mongoExpress = require('mongo-express/lib/middleware')
  var mongoExpressConfig = require("../config/mongo_express_config");
  app.use(config.mongoExpress.url, mongoExpress(mongoExpressConfig))
}

var errorHandler = require("./error-handler");
app.use(errorHandler);


/* SET UP SERVER */
let host = config.server.host;
let port = config.server.port;

var http = require("http");

http.createServer(app).listen(port, host, function () {
  console.log('Listening on ' + host + ':' + port + '!');
});