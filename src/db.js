var config = require("../config");

var mongoose = require('mongoose');

mongoose.plugin(require('mongoose-paginate'));

mongoose.Promise = global.Promise;

var connection = mongoose.connect(config.database.uri,config.database.options)
  .then(() => console.log("Connected to " + config.database.uri))
  .then(() => mongoose)
  .catch(err => {
    throw new Error("Error when connectiong to " + config.database.uri + ": " + err.message); // if not connected the app will not throw any errors when accessing DB models, better to fail hard and fix
  });

var models = require("./models"); // just load, so that we dont have to worry about missing schemas for references

module.exports = connection;