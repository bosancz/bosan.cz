const mongoose = require("mongoose");

const path = require("path");
const config = require("../../config");

const Member = require("./member"); // load because of reference
const EventRecurring = require("./event-recurring"); // load because of reference

var eventSchema = mongoose.Schema({

  "status": {type: String, enum: ['draft','public'], required: true, default: 'draft'},
  "cancelled": { type: Boolean, default: false },
  "srcId": Number,

  "name": {type: String, required: true},
  "place": String,
  "description": String,

  "dateFrom": Date,
  "dateTill": Date,
  
  "timeFrom": String,
  "timeTill": String,
  
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
}, { toObject: { virtuals: true } });

module.exports = mongoose.model("Event", eventSchema);