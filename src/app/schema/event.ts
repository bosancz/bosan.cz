export class Event {
  
  //required
  _id:string;
  status:string;
  
  name:string;
  type:string;
  place:string;
  description:string;
  
  attendees:any[];
  leaders:any[];
  
  //optional
  groups?:string[];
  dateFrom?:Date;
  dateTill?:Date;
  image?:String;
}