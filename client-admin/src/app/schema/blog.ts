import { Document } from "./api";

export interface Blog extends Document {
  _id: string;
  status: string;
  title: string;
  perex?: string;
  content?: string;
  datePublished?: string;
}