const mongoose = require("mongoose");

var eventSchema = mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["draft", "pending", "public", "cancelled", "rejected"],
      required: true,
      default: "draft",
    },
    statusNote: { type: String },

    srcId: Number,

    name: { type: String, required: true },
    place: String,
    description: String,

    dateFrom: Date,
    dateTill: Date,

    timeFrom: String,
    timeTill: String,

    order: Number,

    meeting: {
      start: String,
      end: String,
    },

    registration: String,
    accounting: String,
    announcement: String,

    groups: [String],
    leadersEvent: Boolean,

    type: { type: String, default: "akce" },
    subtype: String,
    srcType: String,

    leaders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
        autopopulate: { select: "_id nickname name group role contacts.mobile" },
      },
    ],

    attendees: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Member", autopopulate: { select: "_id nickname name group role" } },
    ],

    leadersLine: String,

    expenses: [
      {
        id: String,
        amount: Number,
        type: { type: String },
        description: String,
      },
    ],

    competition: {
      water_km: Number,
      river: String,
    },

    etl: String,
  },
  { toObject: { virtuals: true } }
);

module.exports = mongoose.model("Event", eventSchema);
