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
    "filter": {
      type: "object",
      properties: {
        "from": { type: "string", format: "date" },
        "till": { type: "string", format: "date" }
      },
      additionalProperties: false
    },
    "populate": { type: "array", items: { enum: ["user"] } },
    "sort": { type: "string" }
  },
  additionalProperties: false
};

router.get("/", validate({query:getErrorsSchema}), acl("errors:list"), async (req,res,next) => {
  var errors = ReportedError.find({}).select("_id message timestamp url");
  
  if(req.query.populate){
    if(req.query.populate.indexOf("user") !== -1) errors.populate("user","_id login");
  }
  
  if(req.query.sort) errors.sort(req.query.sort);
  
  res.json(await errors);
});


var createErrorSchema = {
  type: 'object',
  properties: {
    "message": { type: "string" },
    "status": { type: "number" },
    "stack": { type: "string" },
    "url": { type: "string" },
    "ng": { 
      component: { type: "string" },
      environment: { type: "string" }
    }      
  },
  additionalProperties: false
};

router.post("/", validate({body:createErrorSchema}), acl("errors:create"), async (req,res) => {
  
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

router.get("/:error", acl("errors:read"), async (req,res,next) => res.json(await ReportedError.findOne({_id:req.params.error})));
