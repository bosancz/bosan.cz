import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import * as URITemplate from "urijs/src/URITemplate";

import { environment } from "environments/environment";

type HttpObserve = 'body' | 'events' | 'response';

export interface HalLinkText {
  href:string;
  type:'text';
  method?:"GET"|"POST"|"PUT"|"PATCH"|"DELETE";
}

export interface HalLinkJson {
  href:string;
  type:'json';
  method?:"GET"|"POST"|"PUT"|"PATCH"|"DELETE";
}

type HalLink = HalLinkText|HalLinkJson;

export interface HalResource {
  _links?:{
    "self":HalLinkText|HalLinkJson,
    [name:string]:HalLinkText|HalLinkJson
  }
}

export class ApiError extends Error{
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  root = environment.apiRoot;

  resources:Promise<{[name:string]:HalResource}>;

  defaultResponseTypes:{[method:string]:'arraybuffer' | 'blob' | 'json' | 'text'} = {
    "GET": "json",
    "POST": "text",
    "PUT": "text",
    "PATCH": "text",
    "DELETE": "text",
  }

  constructor(private http:HttpClient) {
    this.loadResources();
  }

  loadResources(){
    this.resources = this.http.get<{[name:string]:HalResource}>(this.root).toPromise();
  }
  
  async path2link(path:any,params?:any):Promise<HalLink>{
    
    if(!path) throw new ApiError("Missing link");
    
    var link;
    
    if(typeof path === "string" && path.match(/^[a-z]+(\:[a-z]+)?$/i)){
      const [name,linkName = "self"] = path.split(":");
      
      const resources = await this.resources;
    
      if(!resources[name]) throw new ApiError("Resource does not exist.");
      if(!resources[name]._links[linkName]) throw new ApiError("Resource link does not exist.");
      
      link = resources[name]._links[linkName];
    }
    else if(typeof path === "string"){
      link = { href: path };
    }
    else if(path.href){
      link = path;
    }
    else{
      throw new ApiError("Invalid link.");
    }
    
    const href = URITemplate(link.href).expand(key => {
      if(params && params[key]){
        const value = params[key];
        delete params[key];
        return value;
      }
      return undefined;
    });
    
    return {
      href: href,
      type: link.type || "json"
    };
      
  }

  async get<T>(path:any,data?:any):Promise<T>{
    const link = await this.path2link(path,data);
    return this.http.get<T>(link.href, { params: this.toParams(data) }).toPromise();
  }
  
  async getAsText(path:any,data?:any):Promise<string>{
    const link = await this.path2link(path);
    return this.http.get(link.href, { params: this.toParams(data), responseType: "text" }).toPromise();
  }
  
  async post(path:any,data?:any):Promise<HttpResponse<string>>{
    const link = await this.path2link(path);
    return this.http.post(link.href, data, { observe: "response", responseType: "text" }).toPromise();
  }
  
  async put(path:any,data?:any):Promise<HttpResponse<string>>{
    const link = await this.path2link(path);
    return this.http.put(link.href, data, { observe: "response", responseType: "text" }).toPromise();
  }
  
  async patch(path:any,data?:any):Promise<HttpResponse<string>>{
    const link = await this.path2link(path);
    return this.http.patch(link.href, data, { observe: "response", responseType: "text" }).toPromise();
  }
  
  async delete(path:any,data?:any):Promise<HttpResponse<string>>{
    const link = await this.path2link(path);
    return this.http.delete(link.href, { observe: "response", responseType: "text" }).toPromise();
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
