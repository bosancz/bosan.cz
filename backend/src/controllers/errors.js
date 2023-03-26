const config = require("../config");

const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

const stringHash = require("string-hash");

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
  //var query = ReportedError.find({}).select("_id message lastTimestamp");
  
  var errors = await ReportedError.aggregate([
    {
      $project: { message: "$message", lastTimestamp: "$lastTimestamp", count: {$size: '$instances'} }
    }
  ]);
  
  req.routes.links(errors,"error");
  
  res.json(errors);
});

routes.post("errors","/",{permission:"errors:create"}).handle(async (req,res) => {

  const message = req.body.message || "Message missing";
  const errorId = stringHash(req.body.message);
  
  delete req.body.message;
  
  var error = await ReportedError.findOne({_id:errorId});
  
  const timestamp = new Date();
  
  if(!error){
    error = await ReportedError.create({
      _id: errorId,
      message: message,
      instances: []
    });
  }
  
  error.lastTimestamp = timestamp;

  if(!error.instances) error.instances = [];
  
  error.instances.push({
    ...req.body,
    timestamp: timestamp,
    user: req.user ? req.user._id : undefined
  });
  
  await error.save();
  
  // respond if succeeded
  res.sendStatus(201);
});

routes.delete("errors","/",{permission:"errors:delete"}).handle(async (req,res) => {

  await ReportedError.remove({});

  res.sendStatus(204);
});

routes.get("error","/:id",{permission:"errors:read"}).handle(async (req,res,next) => {
  var error = await ReportedError.findOne({_id:req.params.id}).populate("instances.user","_id login");
  if(!error) return res.sendStatus(404);
  error = req.routes.links(error.toObject(),"error");
  res.json(error);
});


routes.delete("error","/:id",{permission:"errors:delete"}).handle(async (req,res) => {
  await ReportedError.remove({_id:req.params.id});
  res.sendStatus(204);
});
