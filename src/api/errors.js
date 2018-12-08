const config = require("../../config");

const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

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

routes.get("errors","/",{permission:"errors:list"}).handle(validate({query:getErrorsSchema}), async (req,res,next) => {
  var query = ReportedError.find({}).select("_id message timestamp url").populate("user","_id login").sort("-timestamp");

  if(req.query.from) query.where({timestamp: { $gte: new Date(req.query.from) }});
  if(req.query.till) query.where({timestamp: { $lt: new Date(req.query.till) }});
  
  res.json(await query);
});

routes.post("errors","/",{permission:"errors:create"}).handle(async (req,res) => {

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

routes.delete("errors","/",{permission:"errors:delete"}).handle(async (req,res) => {

  await ReportedError.remove({});

  res.sendStatus(204);
});

routes.get("error","/:id",{permission:"errors:read"}).handle(async (req,res,next) => {
  res.json(await ReportedError.findOne({_id:req.params.id}).populate("user","_id login"));
});
