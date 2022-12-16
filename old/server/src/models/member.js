var mongoose = require("mongoose");

var memberSchema = mongoose.Schema({
  srcId: Number,

  nickname: String,
  group: String,
  role: String,
  function: String,
  rank: String,
  inactive: { type: Boolean, default: false },
  membership: String,

  name: {
    first: String,
    last: String,
  },

  birthday: Date,

  address: {
    street: String,
    streetNo: String,
    city: String,
    postalCode: String,
    country: String,
  },

  contacts: {
    mobile: String,
    email: String,
    mother: String,
    father: String,
  },

  achievements: [
    {
      id: String,
      dateFrom: Date,
      dateTill: Date,
    },
  ],

  faceDescriptor: [{ type: Number, select: false }],
});

module.exports = mongoose.model("Member", memberSchema);
