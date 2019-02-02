import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

//import * as URITemplate from "urijs/src/URITemplate";

import { environment } from "environments/environment";

import { Document,DocumentLink } from "app/core/schema/api";

export class ApiError extends Error{
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  root = environment.apiRoot;

  resources:Promise<{ [name:string]:DocumentLink }>;

  constructor(private http:HttpClient) {
    this.loadResources();
    console.log("API LOADED");
  }

  loadResources(){
    this.resources = this.http.get<any>(this.root).toPromise().then(api => api._links);
  }
  
  link2href(link):string{
    if(!link.href.match(/^[a-z]+\:\/\//)) return this.root + link.href;
    else return link.href;
  }
  
  async path2href(pathObj:any):Promise<string>{
    
    if(!pathObj) throw new ApiError("Missing link");
    
    var path:any;
    var expand:any;
    
    if(Array.isArray(pathObj) && pathObj.length <= 2) [path,expand] = pathObj;
    else if(Array.isArray(pathObj) && pathObj.length > 2){ path = pathObj.shift(); expand = pathObj; }
    else path = pathObj;
    
    var href;
    
    if(typeof path === "string" && path.match(/^[a-z\-\:]+$/i)){
      const resources = await this.resources;
    
      if(!resources[path]) throw new ApiError(`Resource ${path} does not exist on the API endpoint ${this.root}.`);
      
      href = resources[path].href;
    }
    else if(typeof path === "string"){
      href = path;
    }
    else if(path.href){
      href = path.href;
    }
    else{
      throw new ApiError("Invalid link: " + JSON.stringify(pathObj));
    }
    
    if(typeof expand === "object") href = this.expandHref(href,key => expand[key]);
    if(typeof expand === "string" || typeof expand === "number") href = this.expandHref(href,key => expand);
    if(Array.isArray(expand)){ var i = 0; href = this.expandHref(href,key => { i++; return expand[i - 1]; }); }
    
    if(!href.match(/^[a-z]+\:\/\//)) href = this.root + href;
    
    return href;
      
  }
  
  expandHref(href:string,expand:any):string{
    //return URITemplate(href).expand(expand)
    return href.replace(/\{([^\}]+)\}/g,(match,p1) => expand(p1));
  }

  async get<T>(path:any,params?:any):Promise<T>{
    const href = await this.path2href(path);
    return this.http.get<T>(href, { params: this.toParams(params) }).toPromise();
  }
  
  async getAsText(path:any,params?:any):Promise<string>{
    const href = await this.path2href(path);
    return this.http.get(href, { params: this.toParams(params), responseType: "text" }).toPromise();
  }
  
  async post(path:any,data?:any):Promise<HttpResponse<string>>{
    const href = await this.path2href(path);
    return this.http.post(href, data, { observe: "response", responseType: "text" }).toPromise();
  }
  
  async put(path:any,data?:any):Promise<HttpResponse<string>>{
    const href = await this.path2href(path);
    return this.http.put(href, data, { observe: "response", responseType: "text" }).toPromise();
  }
  
  async patch(path:any,data?:any):Promise<HttpResponse<string>>{
    const href = await this.path2href(path);
    return this.http.patch(href, data, { observe: "response", responseType: "text" }).toPromise();
  }
  
  async delete(path:any,expand?:any):Promise<HttpResponse<string>>{
    const href = await this.path2href(path);
    return this.http.delete(href, { observe: "response", responseType: "text" }).toPromise();
  }  

  private setParam(params:HttpParams,name:string,value:any){
    if(value === undefined) return params;

    if(value === null) return params.set(name,null);

    if(typeof value !== "object") return params.set(name,value);

    if(Array.isArray(value)){
      value.forEach((item,i) => params = this.setParam(params,name + "[" + i + "]",item));
      return params;
    }

    Object.entries(value).forEach(entry => params = this.setParam(params,name + "[" + entry[0] + "]",entry[1]));
    return params;
  }

  private toParams(options:{[s:string]:any}):HttpParams{
    let params = new HttpParams();

    if(options) Object.entries(options).forEach(entry => params = this.setParam(params,entry[0],entry[1]));

    return params;
  }
}
