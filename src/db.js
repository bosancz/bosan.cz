var config = require("../config/config");

var mongoose = require('mongoose');

mongoose.plugin(require('mongoose-paginate'));

mongoose.Promise = global.Promise;

var connection = mongoose.connect("mongodb://127.0.0.1:27017/bosan-test",config.database.options)
  .then(() => console.log("Connected to " + config.database.uri))
  .then(() => mongoose)
  .catch(err => {
    throw new Error("Error when connectiong to " + config.database.uri + ": " + err.message); // if not connected the app will not throw any errors when accessing DB models, better to fail hard and fix
  });

module.exports = connection;