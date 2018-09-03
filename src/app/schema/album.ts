export { Photo } from "./photo";
import { Photo } from "./photo";

export class Album {
  _id:string;
  year:number;
  status:string;
  name:string;
  description:string;
  
  datePublished:Date;
  dateFrom:Date;
  dateTill:Date;
  
  event:any;
  
  titlePhoto:Photo;
  titlePhotos:Photo[];
  photos:Photo[]
}