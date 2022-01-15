export { Photo } from "./photo";
import { Photo } from "./photo";
import { Document } from "./api-document";

export interface Album<P = Photo, TP = P> extends Document {
  _id: string;
  year: number;
  status: string;
  name: string;
  description: string;

  datePublished: string;
  dateFrom: string;
  dateTill: string;

  event: any;

  titlePhotos: TP[];
  photos: P[];

  shareUrl?: string;
}