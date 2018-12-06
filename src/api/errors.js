const config = require("../../config");

const { Routes } = require("../../lib/routes");
const routes = new Routes({url:config.api.root + "/errors", routerOptions: { mergeParams: true }});
module.exports = routes.router;

const acl = require("express-dynacl");

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

routes.get("errors","/").handle(validate({query:getErrorsSchema}), acl("errors:list"), async (req,res,next) => {
  var query = ReportedError.find({}).select("_id message timestamp url").populate("user","_id login").sort("-timestamp");

  if(req.query.from) query.where({timestamp: { $gte: new Date(req.query.from) }});
  if(req.query.till) query.where({timestamp: { $lt: new Date(req.query.till) }});
  
  res.json(await query);
});

routes.post("errors","/").handle(acl("errors:create"), async (req,res) => {

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

routes.delete("errors","/").handle(acl("errors:delete"), async (req,res) => {

  await ReportedError.remove({});

  res.sendStatus(204);
});

routes.get("error","/:id").handle(acl("errors:read"), async (req,res,next) => {
  res.json(await ReportedError.findOne({_id:req.params.id}).populate("user","_id login"));
});
