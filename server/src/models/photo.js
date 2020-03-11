var mongoose = require("mongoose");

var path = require("path");
var config = require("../../config");

var Album = require("./album");
var Member = require("./album");

var photoSchema = mongoose.Schema({
  title: String,

  name: String,
  caption: String,

  album: { type: mongoose.Schema.Types.ObjectId, ref: "Album", required: true },

  width: Number,
  height: Number,

  date: Date,
  tags: [String],

  fromSized: Boolean,

  sizes: {
    original: { width: Number, height: Number, file: String },
    big: { width: Number, height: Number, file: String },
    small: { width: Number, height: Number, file: String },
  },

  bg: String,

  faces: [{
    rectangle: {
      x: Number,
      y: Number,
      width: Number,
      height: Number,
    },

    descriptor: [Number],

    expression: String,

    member: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
  }]

}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

function getUrl(photo, size, root) {
  return root + "/" + String(photo.album) + "/" + photo.sizes[size].file;
}
photoSchema.virtual("sizes.original.url").get(function () { return getUrl(this, "original", config.photos.storageUrl); });
photoSchema.virtual("sizes.big.url").get(function () { return getUrl(this, "big", config.photos.thumbsUrl); });
photoSchema.virtual("sizes.small.url").get(function () { return getUrl(this, "small", config.photos.thumbsUrl); });

photoSchema.index({ tags: 1 }, { sparse: true });
photoSchema.index({ album: 1, tags: 1 }, { sparse: true });

module.exports = mongoose.model("Photo", photoSchema);