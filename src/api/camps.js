var express = require("express");
var router = module.exports = express.Router();

var Camp = require("../models/camp");

router.get("/", Camp.find().select("name dateFrom dateTill theme").middleware() );

router.get("/:camp", (req,res,next) => Camp.findOne({_id:req.params.camp}).select("name dateFrom dateTill theme").res(res,next) );