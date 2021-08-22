import mongoose from "mongoose";
import "./event.js";
import "./photo.js";

const albumSchema = mongoose.Schema(
  {
    status: { type: String, enum: ["public", "draft"], required: true, default: "draft" },
    name: String,
    description: String,
    year: Number,

    srcId: String,

    datePublished: Date,
    dateFrom: { type: Date, required: true },
    dateTill: Date,

    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },

    titlePhoto: { type: mongoose.Schema.Types.ObjectId, ref: "Photo" },
    titlePhotos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Photo" }],
    photos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Photo" }],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const Album = mongoose.model("Album", albumSchema);
