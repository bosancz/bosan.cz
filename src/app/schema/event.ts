export class EventRecurring{
  recurring:string;
  startDate:Date;
  endDate:Date;
  instances:any[];
}

export type EventLeader = string;

export class Event {
  
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
  
  order?:number;
  
  meeting?:{
    start?:string,
    end?:string
  } = {};
  
  attendees?:any[] = [];
  leaders?:any[] = [];
  
  registration?:string;
  
  groups?:string[];
  leadersEvent?:boolean;
  
  _links?:{[name:string]:string};
  _actions?:{[name:string]:string};
}