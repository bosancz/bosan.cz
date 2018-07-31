var mongoose = require("mongoose");

require("./photo");

var albumSchema = mongoose.Schema({
  "year": Number,
  
  "name": String,
  "description": String,
  
  "published": Date,
  
  "titlePhoto": {type: mongoose.Schema.Types.ObjectId, ref: "Photo"},
  "photos": [{type: mongoose.Schema.Types.ObjectId, ref: "Photo"}]
});

module.exports = mongoose.model("Album", albumSchema);