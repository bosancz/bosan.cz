var mongoose = require("mongoose");

var Album = require("./album"); // load because of reference

var eventSchema = mongoose.Schema({
  "name": {type: String, required: true},
  "status": {type: String, enum: ['public', 'draft'], required: true, default: 'draft'},
  
  "dateFrom": Date,
  "dateTill": Date,
  
  "album": {type: mongoose.Schema.Types.ObjectId, ref: "Album"},
});

module.exports = mongoose.model("Event", eventSchema);