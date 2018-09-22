var mongoose = require("mongoose");

var paymentSchema = mongoose.Schema({
  "_id": Number,
  
  "type": String,
  
  "member": {type: mongoose.Schema.Types.ObjectId, ref: "Member"},
  "event": {type: mongoose.Schema.Types.ObjectId, ref: "Event"},
  
  "amountDue": Number,
  "amountPaid": Number
});

module.exports = mongoose.model("Payment", paymentSchema);