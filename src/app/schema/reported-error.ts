export class ReportedError { 
  message:string;
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