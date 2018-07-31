
import { Contact } from "./contact";

export class WebConfigGroup{
  id:string;
  name:string;
  color:string;
}

export class WebConfig {
  about:{contacts: Contact[]} = {contacts: []};

  documents:{url:string} = {url: ""};

  groups:WebConfigGroup[] = [];

  members:{
    roles:string[]
  } = {roles:[]}
}