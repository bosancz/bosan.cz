import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from "rxjs";

import { environment } from "environments/environment";

declare const gapi:any;

declare const window:any;

export class GoogleError extends Error {
  
  name:string = "GoogleError"; // when transpiled to ES5 cant test if instanceof GoogleError
  
  description?:string;
}


@Injectable({
  providedIn: 'root'
})
export class GoogleService {

  gapi:any;

  loaded:BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {
    this.load_gapi();
  }

  async load_gapi(){
    // wait for the GAPI <script> to be loaded
    const gapi:any = await new Promise((resolve,reject) => {
      if(window.gapi){
        resolve(window.gapi);
      }
      else{
        window.gapi_loaded = function() { resolve(window.gapi); }
      }
    });

    // https://github.com/google/google-api-javascript-client/blob/master/samples/loadedDiscovery.html
    await new Promise((resolve,reject) => {
      gapi.load('client:auth2', resolve);
    });

    try{
      await gapi.client.init(environment.gapi);
    }
    catch(googleErr){
      const err = new GoogleError(googleErr.error);
      err.description = googleErr.details;
      throw err;
    }     

    this.gapi = gapi;

    this.loaded.next(true);
  }

  getAuthInstance(){
    if(!this.gapi) return undefined;
    return this.gapi.auth2.getAuthInstance();
  }

  async signIn():Promise<string>{

    try{
      const auth2 = this.getAuthInstance();

      await auth2.signIn();

      const token = auth2.currentUser.get().getAuthResponse(true).id_token;

      return token;
    }
    catch(googleErr){
      const err = new GoogleError(googleErr.error);
      err.description = googleErr.details;
      throw err;
    }

  }

  async signOut():Promise<void>{
    const auth2 = this.getAuthInstance();
    if(auth2) await auth2.signOut();
  }

  async isSignedIn():Promise<boolean> {
    const auth2 = this.getAuthInstance();
    return auth2 ? await auth2.isSignedIn.get() : false;
  }

  async getCurrentUser() {

    if(!await this.isSignedIn()) return null;

    const auth2 = this.getAuthInstance();

    let profile = auth2.currentUser.get().getBasicProfile();

    return {
      email: profile.getEmail(),
      token: auth2.currentUser.get().getAuthResponse(true).id_token
    };
  }
}
