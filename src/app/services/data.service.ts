import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { environment } from '../../environments/environment';

import { Camp } from "../schema/camp";
import { Contact } from "../schema/contact";
import { Event } from "../schema/event";
import { WebConfig } from "../schema/webconfig";

function toParams(options){
	if(!options) return "";
	
	var params = Object.keys(options)
		.map(key => {
			if(typeof options[key] === "object") return Object.keys(options[key]).map(key2 => key + "[" + key2 + "]=" + options[key][key2]).join("&");
			else return key + "=" + options[key];
		})
		.join("&");
	
	return "?" + params;
}

@Injectable()
export class DataService {
  
  root:string = environment.api_root;
  
  config:Promise<WebConfig>;
	
	constructor(private http: HttpClient) {  }
	
  getAlbum(albumId:string, options?):any{
		return this.http.get<any>(this.root + "/albums/" + albumId + toParams(options)).toPromise();
	}
  
  getAlbums(options?):any{
		return this.http.get<any>(this.root + "/albums" + toParams(options)).toPromise();
	}
  
  getAlbumsYears(){
    return this.http.get<any>(this.root + "/albums/years").toPromise();
  }
  
  getCamps(){
    return this.http.get<Camp[]>(this.root + "/camps").toPromise();
  }
  
  getCamp(id:string){
    return this.http.get<Camp>(this.root + "/camps/" + id).toPromise();
  }
  
  saveCamp(id:string,camp:Camp){
    return this.http.put(this.root + "/camps/" + id, camp, { responseType: "text" }).toPromise();
  }
  
  getConfig(update?:boolean){
    if(update || !this.config) this.config = this.http.get<WebConfig>(this.root + "/config").toPromise();
    return this.config;
  }
  
  saveConfig(config:WebConfig):Promise<string>{
    return this.http.put(this.root + "/config", config, { responseType: "text" }).toPromise();
  }
  
  getContacts(options?:any):Promise<Contact[]>{
    return this.http.get<Contact[]>(this.root + "/contacts" + toParams(options)).toPromise();
  }
  
  getEvents(options?:any):Promise<Event[]>{
    return this.http.get<Event[]>(this.root + "/events" + toParams(options)).toPromise();
  }
  
  getUpcomingEvents():Promise<Event[]>{
    return this.http.get<Event[]>(this.root + "/events/upcoming").toPromise();
  }
  
	getGroups(options?:any):Promise<any>{
		return this.http.get<any>(this.root + "/groups" + toParams(options)).toPromise();
	}
  
  getMembers(options?:any):Promise<any>{
    return this.http.get<any>(this.root + "/members" + toParams(options)).toPromise();
  }
}