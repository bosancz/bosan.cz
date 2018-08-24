var mongoose = require("mongoose");

var Event = require("./event");

var eventRecurringSchema = mongoose.Schema({
  type: [{type: String, enum: ["daily","weekly","monthly","yearly"], required: true}],
  startDate: {type: Date, required: true},
  endDate: {type: Date, required: true},
  events: [{type: mongoose.Schema.Types.ObjectId, ref: "Event"}]
});

module.exports = mongoose.model("EventRecurring", eventRecurringSchema);