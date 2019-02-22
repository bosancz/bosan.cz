export { Photo } from "./photo";
import { Photo } from "./photo";
import { Document } from "./api";

export class Album extends Document {
  _id:string;
  year:number;
  status:string;
  name:string;
  description:string;
  
  datePublished:string;
  dateFrom:string;
  dateTill:string;
  
  event:any;
  
  titlePhoto:Photo;
  titlePhotos:Photo[];
  photos:Photo[];
    
  shareUrl?:string;
}