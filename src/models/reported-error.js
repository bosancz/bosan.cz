var mongoose = require("mongoose");

const actions = require("../plugins/mongoose-actions");

const config = require("../../config");

var reportedErrorSchema = mongoose.Schema({
  
  "_id": String,
  "message": String,
  "lastTimestamp": Date,
  
  "instances": [{
    "timestamp": Date,
    "url": String,

    "status": Number,
    "description": String,
    "stack": String,
    "user": {type: mongoose.Schema.Types.ObjectId, ref: "User"},

    "ng": {
      "component": String,
      "environment": String
    }
  }]

}, { toObject: { virtuals: true } });

reportedErrorSchema.plugin(actions, {
  root: config.api.root,
  links: {
    "self": error => `/errors/${error._id}`,
  }
});

module.exports = mongoose.model("ReportedError", reportedErrorSchema);