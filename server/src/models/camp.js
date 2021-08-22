import mongoose from "mongoose";

import { Album } from "./album.js"; // load because of reference

var campSchema = mongoose.Schema({
  name: String,
  dateFrom: Date,
  dateTill: Date,
  theme: String,
  album: { type: mongoose.Schema.Types.ObjectId, ref: "Album" },
});

export const Camp = mongoose.model("Camp", campSchema);
