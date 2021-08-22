import mongoose from "mongoose";

var paymentSchema = mongoose.Schema({
  _id: Number,

  type: String,
  bankId: Number,

  member: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  camp: { type: mongoose.Schema.Types.ObjectId, ref: "Camp" },

  amountDue: Number,
  amountPaid: Number,
});

export const Payment = mongoose.model("Payment", paymentSchema);
