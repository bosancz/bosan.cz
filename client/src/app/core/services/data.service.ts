import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from "environments/environment";

import { Paginated } from "app/shared/schema/paginated";
import { Album, Photo } from "app/shared/schema/album";
import { Camp } from "app/shared/schema/camp";
import { Contact } from "app/shared/schema/contact";
import { Event, EventRecurring } from "app/shared/schema/event";
import { Member } from "app/shared/schema/member";
import { Payment } from "app/shared/schema/payment";
import { User } from "app/shared/schema/user";

function setParam(params:HttpParams,name:string,value:any){
  if(value === undefined) return params;

  if(value === null) return params.set(name,null);

  if(typeof value !== "object") return params.set(name,value);

  if(Array.isArray(value)){
    value.forEach((item,i) => params = setParam(params,name + "[" + i + "]",item));
    return params;
  }

  Object.entries(value).forEach(entry => params = setParam(params,name + "[" + entry[0] + "]",entry[1]));
  return params;
}

function toParams(options:{[s:string]:any}):HttpParams{
  let params = new HttpParams();

  if(options) Object.entries(options).forEach(entry => params = setParam(params,entry[0],entry[1]));

  return params;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  root:string = environment.apiRoot;

  constructor(private http:HttpClient) {  }

  /* INDIVIDUAL API REQUESTS */

  getAlbums(options?:any):Promise<Paginated<Album>>{
    return this.http.get<Paginated<Album>>(this.root + "/albums", {params: toParams(options)}).toPromise();
  }

  getAlbumsRecent(options?:any):Promise<Album[]>{
    return this.http.get<Album[]>(this.root + "/albums/recent", {params: toParams(options)}).toPromise();
  }

  getAlbumsYears(){
    return this.http.get<any>(this.root + "/albums/years").toPromise();
  }
  getAlbumsList(options?:any){
    return this.http.get<any>(this.root + "/albums/list", {params: toParams(options)}).toPromise();
  }

  getAlbum(albumId:string, options?):Promise<Album>{
    return this.http.get<Album>(this.root + "/albums/" + albumId, {params: toParams(options)}).toPromise();
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
    return this.http.get<Photo[]>(this.root + "/albums/" + albumId + "/photos", {params: toParams(options)}).toPromise();
  }

  getAlbumTags(albumId:string):Promise<string[]>{
    return this.http.get<string[]>(this.root + "/albums/" + albumId + "/tags").toPromise();
  }

  getPhotos(options?:any):Promise<Photo[]>{
    return this.http.get<Photo[]>(this.root + "/photos", {params: toParams(options)}).toPromise();
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
    return this.http.get<Camp[]>(this.root + "/camps", {params: toParams(options)}).toPromise();
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

  /* MEMBERS */
  getMembers(options?:any):Promise<Member[]>{
    return this.http.get<Member[]>(this.root + "/members", {params: toParams(options)}).toPromise();
  }

  getMember(memberId:string,options?:any):Promise<any>{
    return this.http.get<any>(this.root + "/members/" + memberId, {params: toParams(options)}).toPromise();
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
    return this.http.get<User[]>(this.root + "/users", {params: toParams(options)}).toPromise();
  }

  getUser(userId:string,options?:any):Promise<User>{
    return this.http.get<User>(this.root + "/users/" + userId, {params: toParams(options)}).toPromise();
  }

  createUser(userId:string,userData:any):Promise<User>{
    return this.http.post<User>(this.root + "/users", userData).toPromise();
  }

  updateUser(userId:string,userData:any):Promise<string>{
    return this.http.patch(this.root + "/users/" + userId, userData, {responseType:"text"}).toPromise();
  }

  deleteUser(userId:string):Promise<string>{
    return this.http.delete(this.root + "/users/" + userId, {responseType:"text"}).toPromise();
  }

  getMe(options?:any):Promise<User>{
    return this.http.get<User>(this.root + "/me", {params: toParams(options)}).toPromise();
  }
  updateMe(userData:any):Promise<string>{
    return this.http.patch(this.root + "/me", userData, {responseType:"text"}).toPromise();
  }
  updateMyPassword(userData:any):Promise<string>{
    return this.http.post(this.root + "/me/password", userData, {responseType:"text"}).toPromise();
  }
  
  
}