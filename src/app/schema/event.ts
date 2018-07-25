export class Event {
  
  //required
  _id:string;
  status:string;
  
  name:string;
  type:string;
  place:string;
  description:string;
  
  attendees:any[];
  leader:[{
    member:string,
    roles:string[]
  }];
  
  //optional
  groups?:string[];
  dateFrom?:Date;
  dateTill?:Date;
  image?:String;
}