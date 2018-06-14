var bcrypt = require("bcryptjs");

var config = require("../../config");

var mongoose = require('mongoose');
mongoose.plugin(require('mongoose-paginate'));
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://' + config.database.host + '/' + config.database.db)
  .then(() => console.log("Connected to database " + config.database.db))
  .catch(err => {
    console.error("Error when connectiong to DB " + config.database.db + ": " + err.message); // if not connected the app will not throw any errors when accessing DB models, better to fail hard and fix
    process.exit();
  });

var User = require("../models/user");


bcrypt.hash("admin", config.bcrypt.rounds)
  .then(hash => User.findOneAndUpdate({_id: "admin"}, { password: hash, roles: ["admin"] }, {upsert: true, new:true}))
  .then(user => {
    console.log("Created user with _id admin and password admin with admin role:");
    console.log(user);
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit();
  })
