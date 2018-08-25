export class EventRecurring{
  recurring:string;
  startDate:Date;
  endDate:Date;
  instances:any[];
}

export class Event {
  
  //required
  _id:string;
  status:string;
  
  name:string;
  type:string;
  subtype:string;
  place:string;
  description:string;
  
  dateFrom:Date;
  dateTill:Date;
  recurring?:EventRecurring;
  
  attendees:any[];
  leaders:any[];
  
  //optional
  groups?:string[];

  image?:String;
}