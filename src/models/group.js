const mongoose = require("mongoose");

const config = require("../../config");

const actions = require("../plugins/mongoose-actions");

const groupSchema = mongoose.Schema({
  "_id": String,
  "name": String,
  "color": String
});

groupSchema.plugin(actions, {
  root: config.api.root,
  links:{
    "self": group => `//groups/${group._id}`,
    "members": group => `//groups/${group._id}/members`
  }
});

module.exports = mongoose.model("Group", groupSchema);