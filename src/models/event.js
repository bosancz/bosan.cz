var mongoose = require("mongoose");

var actions = require("../plugins/mongoose-actions");

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
}, { toJSON: { virtuals: true } });

eventSchema.virtual("registrationUrl").get(function(){return this.registration ? (config.events.storageUrl + "/" + path.join(String(this._id),this.registration)) : undefined;});

eventSchema.plugin(actions, {
  actions:{
    "publish": {
      query: {status: "draft"},
      action: event => {
        this.status = "public";
        return this.save();
      }
    },

    "unpublish": {
      query: {status: "public"},
      action: event => {
        this.status = "draft";
        return this.save();
      }
    }
  }
});

module.exports = mongoose.model("Event", eventSchema);