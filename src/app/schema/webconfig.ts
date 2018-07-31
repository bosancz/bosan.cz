
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
    

export class WebConfig {
  about:{contacts: Contact[]} = {contacts: []};

  documents:{url:string} = {url: ""};

  groups:WebConfigGroup[] = [];

  members:{
    roles:string[],
    achievements:WebConfigAchievement[]
  } = {
    roles:[],
    achievements:[]
  };
  
  events:{
    types:string[]
  } = {
    types:[]
  };
}