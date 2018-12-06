const config = require("../../config");

const { Routes } = require("../../lib/routes");
const routes = new Routes({url:config.api.root + "/payments"});
module.exports = routes.router;

var acl = require("express-dynacl");

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
          
routes.get("payments","/").handle(validate({query:getPaymentsSchema}), acl("payments:list"), async (req,res) => {
  let payments = Payment.find();
  
  if(req.query.filter) payments.where(req.query.filter);

  res.json(await payments);
});

routes.post("payments","/").handle(acl("payments:create"), async (req,res) => {
  var payment = Payment.create(req.body);
  res.json(await payment);
});

routes.get("payment","/:id").handle(acl("payments:read"), async (req,res) => res.json(await Payment.findOne({_id:req.params.id})) );

routes.patch("payment","/:id").handle(acl("payments:edit"), async (req,res) => {
  await Payment.findOneAndUpdate({_id:req.params.id},req.body)
  res.sendStatus(204);
});

routes.delete("payment","/:id").handle(acl("payments:delete"), async (req,res) => {
  await Payment.deleteOne({_id:req.params.id});
  res.sendStatus(204);
});