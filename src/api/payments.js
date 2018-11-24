var express = require("express");
var router = module.exports = express.Router();

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
          
router.get("/", validate({query:getPaymentsSchema}), acl("payments:list"), async (req,res) => {
  let payments = Payment.find();
  
  if(req.query.filter) payments.where(req.query.filter);

  res.json(await payments);
});

router.post("/", acl("payments:create"), async (req,res) => {
  var payment = Payment.create(req.body);
  res.json(await payment);
});

router.get("/:payment", acl("payments:read"), async (req,res) => res.json(await Payment.findOne({_id:req.params.payment})) );

router.patch("/:payment", acl("payments:edit"), async (req,res) => {
  
  await Payment.findOneAndUpdate({_id:req.params.payment},req.body)
  
  res.sendStatus(204);
  
});

router.delete("/:payment", acl("payments:delete"), async (req,res) => {
  await Payment.deleteOne({_id:req.params.payment});
  res.sendStatus(204);
});