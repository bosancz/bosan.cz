var mongoose = require("mongoose");

var Album = require("./album"); // load because of reference

var campSchema = mongoose.Schema({
  "name": String,
  "dateFrom": Date,
  "dateTill": Date,
  "theme": String,
  "album": {type: mongoose.Schema.Types.ObjectId, ref: "Album"}
});

module.exports = mongoose.model("Camp", campSchema);