var mongoose = require("mongoose");

var memberSchema = mongoose.Schema({
  
  "srcId": Number,
  
  "nickname": String,
  "group": String,
  "role": String,
  "inactive": { type: Boolean, default: false },
  "membership": String,
  
  "name": {
    "first": String,
    "last": String
  },
  
  "birthday": Date,
  
  "address": {
    "street": String,
    "streetNo": String,
    "city": String,
    "postalCode": String,
    "country": String
  },
  
  "contacts": {
    "mobile": String,
    "email": String,
    "mother": String,
    "father": String
  },

  "achievements": [{
    "id": String,
    "dateFrom": Date,
    "dateTill": Date
  }],

  "faceDescriptor": [Number],
  "newFaceDescriptor": Boolean
  
});

export const MemberModel = mongoose.model("Member", memberSchema);