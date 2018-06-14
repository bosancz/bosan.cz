export class Event {
  
  //required
  _id:string;
  name:string;
  status:string;
  
  //optional
  groups?:string[];
  dateFrom?:Date;
  dateTill?:Date;
  image?:String;
}