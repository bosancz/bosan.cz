import mongoose from "mongoose";

var reportedErrorSchema = mongoose.Schema(
  {
    _id: String,
    message: String,
    lastTimestamp: Date,

    instances: [
      {
        timestamp: Date,
        url: String,
        navigator: String,
        status: Number,
        description: String,
        stack: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

        ng: {
          component: String,
          environment: String,
        },
      },
    ],
  },
  { toObject: { virtuals: true } }
);

export const ReportedError = mongoose.model("ReportedError", reportedErrorSchema);
