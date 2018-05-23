var express = require("express");
var router = module.exports = express.Router();

var Group = require("../models/group");

var schema = require("express-jsonschema");

var groupsSchema = {
  type: "object",
  properties: {
  }	
};

router.get("/", schema.validate({query: groupsSchema}), (req,res,next) => {
  
  Group.find({})
    .then(events => res.json(events))
    .catch(err => next(err));
  
});