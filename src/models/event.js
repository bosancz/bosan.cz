const mongoose = require("mongoose");

const path = require("path");
const config = require("../../config");

const Member = require("./member"); // load because of reference
const EventRecurring = require("./event-recurring"); // load because of reference

var eventSchema = mongoose.Schema({

  "status": { type: String, enum: ['draft','pending','public','cancelled'], required: true, default: 'draft' },  
  "statusNote": { type: String },
  
  "srcId": Number,

  "name": {type: String, required: true},
  "place": String,
  "description": String,

  "dateFrom": Date,
  "dateTill": Date,
  
  "timeFrom": String,
  "timeTill": String,
  
  "recurring": {type: mongoose.Schema.Types.ObjectId, ref: "EventRecurring"},
  
  "order": Number,

  "meeting": {
    "start": String,
    "end": String
  },

  "registration":String,
  "accounting":String,
  "announcement":String,

  "groups": [String],
  "leadersEvent": Boolean,

  "type": String,
  "subtype": String,
  "srcType": String,

  "leaders":[{ type: mongoose.Schema.Types.ObjectId, ref: "Member", autopopulate: { select: '_id nickname name group role' } }],
  
  "attendees":[{ type: mongoose.Schema.Types.ObjectId, ref: "Member", autopopulate: { select: '_id nickname name group role' } }],

  "leadersLine": String,
  
  "expenses": [{
    "id": String,
    "amount": Number,
    "type": { type: String },
    "description": String
  }],
  
  "etl":String
  
}, { toObject: { virtuals: true } });

module.exports = mongoose.model("Event", eventSchema);