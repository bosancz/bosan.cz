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
  logString: (event) => {
    var params = {
      "Action": event.action,
      "User": event.req.user ? event.req.user._id : null,
      "Role": event.role,
      "Params": Object.keys(event.params).length ? JSON.stringify(event.params) : null,
      "Source": event.req.headers['x-forwarded-for'] || event.req.connection.remoteAddress,
      "Url": event.req.originalUrl
    };
    return `DynACL ${event.permission ? "OK" : "XX"} :: ` + Object.entries(params).filter(param => param[1]).map(param => `${param[0]}: ${param[1]}`).join(", ");
  }
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