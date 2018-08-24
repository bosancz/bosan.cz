
import { Contact } from "./contact";

export class WebConfigGroup{
  id:string;
  name:string;
  color:string;
}

export class WebConfigAchievement{
  id:string;
  name:string;
  image:string;
}

export interface WebConfig {
  
  general:{
    title:string
  };
  
  users:{
    roles:Array<{name:string,title:string,desription:string}>
  };
  
  about:{
    contacts: Contact[]
  };

  camp:{
    album:string
  };
  
  documents:{
    url:string
  };

  members:{
    roles:Array<{id:string}>,
    groups:WebConfigGroup[],
    achievements:WebConfigAchievement[]
  };
  
  events:{
    types:Array<{name:string,image:string}>
  };
}