import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { environment } from '../../environments/environment';

import { Event } from "../schema/event";

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
	
	constructor(private http: HttpClient) { }
	
  getAlbum(albumId:string, options?):any{
		return this.http.get<any>(this.root + "/albums/" + albumId + toParams(options)).toPromise();
	}
  
  getAlbums(options?):any{
		return this.http.get<any>(this.root + "/albums/" + toParams(options)).toPromise();
	}
  
  getAlbumsYears(){
    return this.http.get<any>(this.root + "/albums/years").toPromise();
  }
  
  getEvents(options?):Promise<Event[]>{
    return this.http.get<Event[]>(this.root + "/events" + toParams(options)).toPromise();
  }
  
	getGroups(options?):any{
		return this.http.get<any>(this.root + "/groups" + toParams(options)).toPromise();
	}
  
  getMembersFrontpage(){
    return this.http.get<any>(this.root + "/members/frontpage").toPromise();
  }
}