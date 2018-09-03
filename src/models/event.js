var mongoose = require("mongoose");

var path = require("path");
var config= require("../../config");

var Member = require("./member"); // load because of reference
var EventRecurring = require("./event-recurring"); // load because of reference

var eventSchema = mongoose.Schema({
  
  "status": {type: String, enum: ['draft','public','cancelled'], required: true, default: 'draft'},
  "srcId": Number,
  
  "name": {type: String, required: true},
  "place": String,
  "description": String,
  
  "dateFrom": Date,
  "dateTill": Date,
  "dateChanged": Date,
  "recurring": {type: mongoose.Schema.Types.ObjectId, ref: "EventRecurring"},
  
  "order": Number,
  
  "meeting": {
    "start": String,
    "end": String
  },
  
  "registration":String,
  
  "groups": [String],
  "leadersEvent": Boolean,
  
  "type": String,
  "subtype": String,
  "srcType": String,
  
  "leaders":[{type: mongoose.Schema.Types.ObjectId, ref: "Member"}],
  
  "leadersLine": String,
  
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