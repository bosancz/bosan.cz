var bcrypt = require("bcryptjs");

var config = require("../../config");

var mongoose = require('../db");

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
