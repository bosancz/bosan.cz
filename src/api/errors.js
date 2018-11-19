const express = require("express");
const router = module.exports = express.Router();

const acl = require("express-dynacl");

const config = require("../../config");

const ReportedError = require("../models").ReportedError;

const mailings = require("../mailings");
const validate = require("../validator");

const getErrorsSchema = {
  type: 'object',
  properties: {
    "from": { type: "string", format: "date-time" },
    "till": { type: "string", format: "date-time" }
  },
  additionalProperties: false
};

router.get("/", validate({query:getErrorsSchema}), acl("errors:list"), async (req,res,next) => {
  var query = ReportedError.find({}).select("_id message timestamp url").populate("user","_id login").sort("-timestamp");

  if(req.query.from) query.where({timestamp: { $gte: new Date(req.query.from) }});
  if(req.query.till) query.where({timestamp: { $lt: new Date(req.query.till) }});
  
  res.json(await query);
});

router.post("/", acl("errors:create"), async (req,res) => {

  const errorData = {
    ...req.body,
    timestamp: new Date(),
    user: req.user ? req.user._id : undefined
  }

  // update or create the user
  var error = await ReportedError.create(errorData);

  // respond if succeeded
  res.sendStatus(201);
});

router.delete("/", acl("errors:delete"), async (req,res) => {

  await ReportedError.remove({});

  res.sendStatus(204);
});

router.get("/:error", acl("errors:read"), async (req,res,next) => {
  res.json(await ReportedError.findOne({_id:req.params.error}).populate("user","_id login"));
});
