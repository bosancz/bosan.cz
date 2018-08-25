import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { Paginated } from "../schema/paginated";
import { Album, Photo } from "../schema/album";
import { Camp } from "../schema/camp";
import { Contact } from "../schema/contact";
import { Event, EventRecurring } from "../schema/event";
import { Member } from "../schema/member";
import { User } from "../schema/user";
import { WebConfig } from "../schema/webconfig";

function toParams(options){
	if(!options) return "";
	
  var params = Object.entries(options)
    .filter(entry => entry[1] !== undefined)
    .map(entry => entry[0] + "=" + entry[1]);

  return params.length ? ("?" + params.join("&")) : "";
}

@Injectable()
export class DataService {
  
  root:string = environment.api_root;
  
  config:Promise<WebConfig>;
	
	constructor(private http: HttpClient) {  }
  
  getAlbums(options?:any):Promise<Paginated<Album>>{
		return this.http.get<Paginated<Album>>(this.root + "/albums" + toParams(options)).toPromise();
	}
  
  getAlbumsYears(){
    return this.http.get<any>(this.root + "/albums/years").toPromise();
  }
  getAlbumsList(options?:any){
    return this.http.get<any>(this.root + "/albums/list" + toParams(options)).toPromise();
  }
  
  getAlbum(albumId:string, options?):Promise<Album>{
		return this.http.get<Album>(this.root + "/albums/" + albumId + toParams(options)).toPromise();
	}
  
  createAlbum(albumData:any):Promise<Album>{
    return this.http.post<Album>(this.root + "/albums", albumData).toPromise();
  }
  
  updateAlbum(albumId:string, albumData:any):Promise<string>{
    return this.http.patch(this.root + "/albums/" + albumId, albumData, {responseType: "text"}).toPromise();
  }
  
  deleteAlbum(albumId:string):Promise<string>{
    return this.http.delete(this.root + "/albums/" + albumId, {responseType: "text"}).toPromise();
  }
  
  getAlbumPhotos(albumId:string,options?:any):Promise<Photo[]>{
    return this.http.get<Photo[]>(this.root + "/albums/" + albumId + "/photos" + toParams(options)).toPromise();
  }
  
  getAlbumTags(albumId:string):Promise<string[]>{
    return this.http.get<string[]>(this.root + "/albums/" + albumId + "/tags").toPromise();
  }
  
  getPhotos(options?:any):Promise<Photo[]>{
    return this.http.get<Photo[]>(this.root + "/photos" + toParams(options)).toPromise();
  }
  
  getPhotosTags():Promise<string[]>{
    return this.http.get<string[]>(this.root + "/photos/tags").toPromise();
  }
  
  createPhoto(photoData):Observable<HttpEvent<string>>{
    return this.http.post(this.root + "/photos",photoData,{observe: 'events',reportProgress:true, responseType:"text"});
  }
  
  updatePhoto(photoId:string,photoData:any):Promise<string>{
    return this.http.patch(this.root + "/photos/" + photoId, photoData, {responseType:"text"}).toPromise();
  }
  
  deletePhoto(photoId:string):Promise<string>{
    return this.http.delete(this.root + "/photos/" + photoId,{responseType:"text"}).toPromise();
  }
  
  /* CAMPS */
  getCamps(options?:any){
    return this.http.get<Camp[]>(this.root + "/camps" + toParams(options)).toPromise();
  }
  
  getCamp(id:string){
    return this.http.get<Camp>(this.root + "/camps/" + id).toPromise();
  }
  
  createCamp(campData:any):Promise<Camp>{
    return this.http.post<Camp>(this.root + "/camps", campData).toPromise();
  }
  
  updateCamp(id:string,campData:Camp):Promise<string>{
    return this.http.patch(this.root + "/camps/" + id, campData, {responseType:"text"}).toPromise();
  }
  
  deleteCamp(campId:string):Promise<string>{
    return this.http.delete(this.root + "/camps/" + campId, {responseType: "text"}).toPromise();
  }
  
  /* CONFIG */
  getConfig(update?:boolean){
    if(update || !this.config) this.config = this.http.get<WebConfig>(this.root + "/config").toPromise();
    return this.config;
  }
  
  saveConfig(config:WebConfig):Promise<string>{
    return this.http.put(this.root + "/config", config, { responseType: "text" }).toPromise();
  }
  
  /* EVENTS */
  getEvents(options?:any):Promise<Paginated<Event>>{
    return this.http.get<Paginated<Event>>(this.root + "/events" + toParams(options)).toPromise();
  }
  
  getUpcomingEvents():Promise<Event[]>{
    return this.http.get<Event[]>(this.root + "/events/upcoming").toPromise();
  }
  
  getEvent(eventId:string,options?:any):Promise<Event>{
    return this.http.get<Event>(this.root + "/events/" + eventId + toParams(options)).toPromise();
  }
  
  createEvent(eventData:any):Promise<Event>{
    return this.http.post<Event>(this.root + "/events",eventData).toPromise();
  }
  
  updateEvent(eventId:string,eventData:any):Promise<string>{
    return this.http.patch(this.root + "/events/" + eventId,eventData, {responseType:"text"}).toPromise();
  }
  
  deleteEvent(eventId:string):Promise<string>{
    return this.http.delete(this.root + "/events/" + eventId, {responseType:"text"}).toPromise();
  }
  
  getEventLeaders(eventId:string):Promise<any[]>{
    return this.http.get<any[]>(this.root + "/events/" + eventId + "/leaders").toPromise();
  }
  
  getEventRecurring(eventId:string,options?:any):Promise<EventRecurring>{
    return this.http.get<EventRecurring>(this.root + "/events/" + eventId + "/recurring" + toParams(options)).toPromise();
  }
  
  createEventRecurring(eventId:string,recurringData:any):Promise<string>{
    return this.http.put(this.root + "/events/" + eventId + "/recurring",recurringData,{responseType:"text"}).toPromise();
  }
  
  deleteEventRecurring(eventId:string):Promise<string>{
    return this.http.delete(this.root + "/events/" + eventId + "/recurring",{responseType:"text"}).toPromise();
  }
  
  /* MEMBERS */
  getMembers(options?:any):Promise<Member[]>{
    return this.http.get<Member[]>(this.root + "/members" + toParams(options)).toPromise();
  }
  
  getMember(memberId:string,options?:any):Promise<any>{
    return this.http.get<any>(this.root + "/members/" + memberId + toParams(options)).toPromise();
  }
  
  createMember(memberData:any):Promise<Member>{
    return this.http.post<Member>(this.root + "/members", memberData).toPromise();
  }
  
  updateMember(memberId:string,memberData):Promise<string>{
    return this.http.patch(this.root + "/members/" + memberId, memberData, {responseType:"text"}).toPromise();
  }
  
  deleteMember(memberId:string):Promise<string>{
    return this.http.delete(this.root + "/members/" + memberId, {responseType:"text"}).toPromise();
  }
  
  /* USERS */
  getUsers(options?:any):Promise<User[]>{
    return this.http.get<User[]>(this.root + "/users" + toParams(options)).toPromise();
  }
  
  getUser(userId:string,options?:any):Promise<User>{
    return this.http.get<User>(this.root + "/users/" + userId + toParams(options)).toPromise();
  }
  
  createUser(userId:string,userData:any):Promise<User>{
    return this.http.put<User>(this.root + "/users/" + userId, userData).toPromise();
  }
  
  updateUser(userId:string,userData:any):Promise<string>{
    return this.http.patch(this.root + "/users/" + userId, userData, {responseType:"text"}).toPromise();
  }
  
  deleteUser(userId:string):Promise<string>{
    return this.http.delete(this.root + "/users/" + userId, {responseType:"text"}).toPromise();
  }
}