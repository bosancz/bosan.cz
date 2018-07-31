var mongoose = require("mongoose");

var Member = require("./member"); // load because of reference
var Group = require("./group"); // load because of reference

var eventSchema = mongoose.Schema({
  "name": {type: String, required: true},
  "status": {type: String, enum: ['public', 'draft'], required: true, default: 'draft'},
  
  "dateFrom": Date,
  "dateTill": Date,
  
  "place": String,
  "description": String,
  
  "groups": [{type: String, ref: "Group"}],
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

module.exports = mongoose.model("Event", eventSchema);