import { Document } from "./api";

export class ReportedErrorInstance {
  url:string;
  timestamp:Date;

  description?:string;
  stack?:string
  status?:number;
  user?:any;

  ng?:{
    component:string;
    environment:string;
  };
}

export class ReportedError extends Document { 
  
  _id:string;
  message:string;
  count?:number;

  instances:ReportedErrorInstance[];
}