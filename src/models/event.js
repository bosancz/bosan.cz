var mongoose = require("mongoose");

var path = require("path");
var config= require("../../config");

var Member = require("./member"); // load because of reference
var EventRecurring = require("./event-recurring"); // load because of reference

var eventSchema = mongoose.Schema({
  "name": {type: String, required: true},
  "status": {type: String, enum: ['draft','public','cancelled'], required: true, default: 'draft'},
  
  "srcId": Number,
  
  "dateFrom": Date,
  "dateTill": Date,
  
  "timeFrom": String,
  "timeTill": String,
  
  "recurring": {type: mongoose.Schema.Types.ObjectId, ref: "EventRecurring"},
  
  "dateChanged": Date,
  
  "place": String,
  "description": String,
  
  "registration":String,
  
  "groups": [String],
  "type": String,
  
  "leaders":[{type: mongoose.Schema.Types.ObjectId, ref: "Member"}],
  
  "attendees": [{
    "member": {type: mongoose.Schema.Types.ObjectId, ref: "Member"},
    "name": String,
    "birthday": Date,
    "address": {
      "street": String,
      "city": String,
      "postalCode": String
    },
    "role": {type: String, enum: ['h','v','i','d'], required: true, default: 'd'}
  }]
});

eventSchema.virtual("registrationUrl").get(function(){return path.join(config.events.storageUrl,this._id,this.registration);});

module.exports = mongoose.model("Event", eventSchema);