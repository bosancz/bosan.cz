var mongoose = require("mongoose");

var paymentSchema = mongoose.Schema({
  "_id": Number,
  
  "type": String,
  "bankId": Number,
  
  "member": {type: mongoose.Schema.Types.ObjectId, ref: "Member"},
  "event": {type: mongoose.Schema.Types.ObjectId, ref: "Event"},
  "camp": {type: mongoose.Schema.Types.ObjectId, ref: "Camp"},
  
  "amountDue": Number,
  "amountPaid": Number
});

module.exports = mongoose.model("Payment", paymentSchema);