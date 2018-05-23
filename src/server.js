var express = require("express");
var app = express();

var config = require("../config/config");

var bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support urlencoded bodies

var mongoose = require('mongoose');
mongoose.plugin(require('mongoose-paginate'));
mongoose.plugin(require('../lib/mongoose-req-plugin'));
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://' + config.database.host + '/' + config.database.db)
  .then(() => console.log("Connected to database " + config.database.db))
  .catch(err => {
    throw new Error("Error when connectiong to DB " + config.database.db + ": " + err.message); // if not connected the app will not throw any errors when accessing DB models, better to fail hard and fix
  });

var logger = (req,res,next) => { console.log(req.method + " " + req.originalUrl); next(); };
app.use(logger);

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