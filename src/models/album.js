var mongoose = require("mongoose");

require("./event");

var albumSchema = mongoose.Schema({
  "name": String,
  "year": Number,
  "event": {type: mongoose.Schema.Types.ObjectId, ref: "Event"},
  "photos": [{
    "file": String,
    "caption": String,
    "width": Number,
    "height": Number
  }]
});

module.exports = mongoose.model("Album", albumSchema);