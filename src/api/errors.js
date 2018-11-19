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
    "from": { type: "string", format: "date" },
    "till": { type: "string", format: "date" }
  },
  additionalProperties: false
};

router.get("/", validate({query:getErrorsSchema}), acl("errors:list"), async (req,res,next) => {
  var errors = ReportedError.find({}).select("_id message timestamp url").populate("user","_id login").sort("-timestamp");

  res.json(await errors);
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
