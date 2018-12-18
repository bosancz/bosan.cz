import { Document } from "./api";

export class EventRecurring{
  recurring:string;
  startDate:Date;
  endDate:Date;
  instances:any[];
}

export type EventLeader = string;

export class Event extends Document {
  
  _id:string;
  status:string;
  
  name:string;
  type:string;
  subtype:string;
  place:string;
  description:string;
  
  dateFrom:Date;
  dateTill:Date;
  allDay:boolean;
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
}