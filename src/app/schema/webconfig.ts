
import { Contact } from "./contact";

export class WebConfigGroup{
  id:string;
  name:string;
  color:string;
  active:boolean;
}

export class WebConfigAchievement{
  id:string;
  name:string;
  image:string;
}

export class WebConfigEventType {
  name:string;
  class:string;
}

export class WebConfigEventSubType{
  name:string;
  class:string;
  image?:string;
}

export class WebConfigRecurringType {
  name:string;
  title:string;
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
    types:WebConfigEventType[],
    subtypes:WebConfigEventSubType[],
    recurringTypes:WebConfigRecurringType[]
  };
}