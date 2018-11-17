var mongoose = require("mongoose");

var reportedErrorSchema = mongoose.Schema({
  
  "message": String,
  "status": Number,
  "stack": String,
  "url": String,
  "ng": {
    "component": String,
    "environment": String
  },
  
  "timestamp": Date,
  "user": {type: mongoose.Schema.Types.ObjectId, ref: "User"}
});

module.exports = mongoose.model("ReportedError", reportedErrorSchema);