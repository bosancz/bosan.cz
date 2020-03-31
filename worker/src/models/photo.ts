var mongoose = require("mongoose");

var photoSchema = mongoose.Schema({
  title: String,

  name: String,
  caption: String,

  album: { type: mongoose.Schema.Types.ObjectId, required: true },

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

    score: Number,

    rectangle: {
      x: Number,
      y: Number,
      width: Number,
      height: Number,
    },

    descriptor: [Number],

    match: {
      member: String,
      distance: Number,
    }

  }]

});

export const PhotoModel = mongoose.model("Photo", photoSchema);