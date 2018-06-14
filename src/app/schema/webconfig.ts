
import { Contact } from "./contact";

export class WebConfig {
  about?:{
    contacts: Contact[]
  };
  
  documents?:{
    url:string
  };
    
  groups:[{
    id:string,
    name:string,
    color:string
  }]
}