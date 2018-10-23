var mongoose = require("mongoose");

var path = require("path");

const config = require("../../config");

require("./photo");
require("./event");

const albumSchema = mongoose.Schema({
  
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

albumSchema.virtual("downloadUrl").get(function(){return `${config.url}/api/albums/${this._id}/download`;});

module.exports = mongoose.model("Album", albumSchema);