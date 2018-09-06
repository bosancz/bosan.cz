var mongoose = require("mongoose");

var path = require("path");

var config= require("../../config");

require("./photo");
require("./event");

var albumSchema = mongoose.Schema({
  
  "status": {type: String, enum: ['public', 'draft'], required: true, default: 'draft'},
  "name": String,
  "description": String,
  "year": Number,
  
  "srcId": String,
  
  "datePublished": Date,
  "dateFrom": Date,
  "dateTill": Date,
  
  "event": {type: mongoose.Schema.Types.ObjectId, ref: "Event"},
  
  "titlePhoto": {type: mongoose.Schema.Types.ObjectId, ref: "Photo"},
  "titlePhotos": [{type: mongoose.Schema.Types.ObjectId, ref: "Photo"}],
  "photos": [{type: mongoose.Schema.Types.ObjectId, ref: "Photo"}]
}, { toJSON: { virtuals: true } });

albumSchema.virtual("shareUrl").get(function(){return config.api.shareRoot + "/" + path.join("fotogalerie",String(this._id));});

module.exports = mongoose.model("Album", albumSchema);