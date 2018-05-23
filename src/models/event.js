var mongoose = require("mongoose");

var Album = require("./album"); // load because of reference

var eventSchema = mongoose.Schema({
  "name": String,
  "dateFrom": Date,
  "dateTill": Date,
  "album": {type: mongoose.Schema.Types.ObjectId, ref: "Album"},
});

module.exports = mongoose.model("Event", eventSchema);