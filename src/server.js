var express = require("express");
var app = express();

// polyfill before express allows for async middleware
require('express-async-errors');

var config = require("../config/config");

var bodyParser = require("body-parser");
app.use(bodyParser.json({ limit:'10mb' })); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true,  limit:'10mb' })); // support urlencoded bodies

var jwt = require('express-jwt');
app.use(jwt(config.jwt));

var mongooseConnection = require("./db");

var dynaclOptions = {
  roles: require("./acl"),
  userRoles: req => req.user ? req.user.roles.concat(["user"]) : [],
  defaultRole: "guest",
  logConsole: true,
  logString: (action,permission,role,req) => "DynACL " + (permission ? "OK" : "XX") + " ( action: " + action + (req.user ? ", user: " + req.user._id : "") + (role ? ", role: " + role : "") + " ) Source: " + (req.headers['x-forwarded-for'] || req.connection.remoteAddress) + " Url: " + req.originalUrl,
};

var dynacl = require("express-dynacl");
dynacl.config(dynaclOptions);

var router = require("./router");
app.use(router);

var errorHandler = require("./error-handler");
app.use(errorHandler);

/* Mongo Express */
if(config.mongoExpress.enabled){
  var mongoExpress = require('mongo-express/lib/middleware')
  var mongoExpressConfig = require("../config/mongo_express_config");
  app.use(config.mongoExpress.url, mongoExpress(mongoExpressConfig))
}

/* SET UP SERVER */
let host = config.host;
let port = config.port;

var http = require("http");

http.createServer(app).listen(port, host, function () {
  console.log('Listening on ' + host + ':' + port + '!');
});