export class ReportedError { 
  message:string;
  url:string;
  timestamp:Date;
  
  stack?:string
  user?:any;
  
  ng?:{
    component:string;
    environment:string;
  };
}