const mongoose = require("mongoose");

const groupSchema = mongoose.Schema(
  {
    _id: String,
    name: String,
    color: String,
  },
  { toJSON: { virtuals: true } }
);

export const Group = mongoose.model("Group", groupSchema);
