import { Document } from "./api";

export class Blog extends Document {
  _id: string;
  status: string;
  title: string;
  perex: string;
  content: string;
  datePublished: string;
}