const config = require("../config");

const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

var Payment = require("../models/payment");

var validate = require("../validator");

var getPaymentsSchema = {
  type: 'object',
  properties: {
    "filter":{
      type: "object",
      properties: {
        "timestamp": { type: "object", properties: {"$gte": {type: "string", format: "date"},"$lte": {type: "string", format: "date"}}, additionalProperties: false},
        "member": { type: "string" },
        "event": { type: "string" },
        "type": { type: "string" }
      }
    }
  },
  additionalProperties: false
};          
          
routes.get("payments","/",{permission:"payments:list"}).handle(validate({query:getPaymentsSchema}), async (req,res) => {
  let payments = Payment.find();
  
  if(req.query.filter) payments.where(req.query.filter);

  res.json(await payments);
});

routes.post("payments","/",{permission:"payments:create"}).handle(async (req,res) => {
  var payment = Payment.create(req.body);
  res.json(await payment);
});

routes.get("payment","/:id",{permission:"payments:read"}).handle(async (req,res) => res.json(await Payment.findOne({_id:req.params.id})) );

routes.patch("payment","/:id",{permission:"payments:edit"}).handle(async (req,res) => {
  await Payment.findOneAndUpdate({_id:req.params.id},req.body)
  res.sendStatus(204);
});

routes.delete("payment","/:id",{permission:"payments:delete"}).handle(async (req,res) => {
  await Payment.deleteOne({_id:req.params.id});
  res.sendStatus(204);
});