const mongoose = require("mongoose");

const actions = require("../plugins/mongoose-actions");

const path = require("path");
const config = require("../../config");

const Member = require("./member"); // load because of reference
const EventRecurring = require("./event-recurring"); // load because of reference

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
}, { toJSON: { virtuals: true } });

eventSchema.plugin(actions, {
  links:{
    "self": event => `${config.api.root}/events/${event._id}`,
    "leaders": event => `${config.api.root}/events/${event._id}/leaders`,
    "recurring": event => `${config.api.root}/events/${event._id}/recurring`,
    "payments": event => `${config.api.root}/events/${event._id}/payments`,
    "registration": event => `${config.api.root}/events/${event._id}/registration`,
    "registration_file": event => event.registration ? (config.events.storageUrl + "/" + path.join(String(event._id),event.registration)) : null
  },
  actions:{
    "publish": {
      href: event => `${config.api.root}/events/${event._id}/actions/publish`,
      query: {status: "draft"},
      action: event => {
        event.status = "public";
      }
    },

    "unpublish": {
      href: event => `${config.api.root}/events/${event._id}/actions/unpublish`,
      query: {status: "public"},
      action: event => {
        event.status = "draft";
      }
    }
  }
});

module.exports = mongoose.model("Event", eventSchema);