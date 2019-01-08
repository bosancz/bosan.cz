import { Injectable, NgZone, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject } from "rxjs";

import { JwtHelperService } from '@auth0/angular-jwt';

export interface Tokens{
  access_token?:string;
  refresh_token?:string;
}

/**
	* Service to save user information and commnicate user data with server
	*/
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public onUpdate:ReplaySubject<void> = new ReplaySubject(1);
  public onExpired:ReplaySubject<void> = new ReplaySubject(1);

  access_token:string;
  refresh_token:string;

  constructor(private jwtHelper:JwtHelperService, ngZone:NgZone){

    // refresh user data to match token
    this.refreshState();

    // periodically check for token validity
    ngZone.runOutsideAngular(() => { // https://github.com/angular/angular/issues/20970
      window.setInterval(() => {
        ngZone.run(() => this.refreshState());
      }, 5 * 1000);
    });

  }

  setTokens(tokens:Tokens){
    if(tokens.access_token) window.localStorage.setItem("access_token", tokens.access_token);
    else window.localStorage.removeItem("access_token");
    
    if(tokens.refresh_token) window.localStorage.setItem("refresh_token", tokens.refresh_token);
    else window.localStorage.removeItem("refresh_token");

    this.access_token = tokens.access_token;
    this.refresh_token = tokens.refresh_token;

    this.onUpdate.next();
  }

  getTokens(){
    return {
      access_token: window.localStorage.getItem("access_token"),
      refresh_token: window.localStorage.getItem("refresh_token")
    };
  }

  deleteTokens(){
    window.localStorage.removeItem("access_token");
    window.localStorage.removeItem("refresh_token");

    this.access_token = null;
    this.refresh_token = null;

    this.onUpdate.next();
  }

  /*
	 * lookup token in storage and check if it is valid. if yes, update state
	 */
  refreshState():void{

    const tokens = this.getTokens();

    // check if token valid
    const tokensValid = tokens && ( (tokens.access_token && !this.jwtHelper.isTokenExpired(tokens.access_token)) || (tokens.refresh_token && !this.jwtHelper.isTokenExpired(tokens.refresh_token)));

    if(!tokensValid && (this.access_token || this.refresh_token)){

      this.access_token = null;
      this.refresh_token = null;

      this.deleteTokens();

      this.onExpired.next();
      this.onUpdate.next();
    }

    if(tokensValid && tokens.access_token !== this.access_token){

      this.access_token = tokens.access_token;
      this.refresh_token = tokens.refresh_token;

      this.onUpdate.next();
    }


  }

}