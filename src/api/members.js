var express = require("express");
var router = module.exports = express.Router();

var Member = require("../models/member");

router.get("/", (req,res,next) => {
  Member.find({}).select("_id nickname name").populate("group", "_id name color")
    .then(contacts => res.json(contacts))
    .catch(err => next(err));
});