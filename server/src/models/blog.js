import mongoose from "mongoose";

const blogSchema = mongoose.Schema(
  {
    status: { type: String, enum: ["public", "draft"], required: true, default: "draft" },
    title: String,
    perex: String,
    content: String,
    datePublished: Date,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const Blog = mongoose.model("Blog", blogSchema);
