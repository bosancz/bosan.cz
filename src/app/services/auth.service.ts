import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, ReplaySubject }    from 'rxjs';

import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from "environments/environment";

import { User } from "app/schema/user";

export class AuthUser{
  _id:string;
  memberId?:string;
  roles:string[] = [];
}

/**
	* Service to save user information and commnicate user data with server
	*/
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiRoot:string = environment.apiRoot;

  public onLogin:ReplaySubject<AuthUser> = new ReplaySubject(1);
  public onLogout:ReplaySubject<AuthUser> = new ReplaySubject(1);
  public onExpired:ReplaySubject<AuthUser> = new ReplaySubject(1);

  // boolean if user is logged
  logged:boolean = false;

  // current user (use blank user as default)
  user:BehaviorSubject<AuthUser> = new BehaviorSubject(null);

  constructor(private http:HttpClient, private jwtHelper:JwtHelperService, ngZone:NgZone){

    // refresh user data to match token
    this.refreshState();

    // periodically renew token and check token validity
    ngZone.runOutsideAngular(() => { // https://github.com/angular/angular/issues/20970
      window.setInterval(() => {
        ngZone.run(() => this.refreshState());
      }, 5 * 1000);
    });

  }

  private saveToken(token){
    return window.localStorage.setItem("id_token", token);
  }

  private getToken(){
    return window.localStorage.getItem("id_token");	
  }

  private deleteToken(){
    return window.localStorage.removeItem("id_token");
  }

  // login by directly providing valid token
  loginToken(token:string){
    if(this.jwtHelper.isTokenExpired(token)) throw new Error("Expired token.");
    // save the token to storage
    this.saveToken(token);
    // update state to match token from storage
    this.refreshState();
    // if user is not logged at this step, token was invalid
    if(this.logged) return this.user;
    else throw new Error("Invalid token");
  }

  /*
	 * lookup token in storage and check if it is valid. if yes, update state
	 */
  refreshState():void{

    // get token from storage
    const token = this.getToken();

    let isExpired = this.jwtHelper.isTokenExpired(token);

    let userData;

    try{
      userData = this.jwtHelper.decodeToken(token);
    }
    catch(err) {
      console.error("Invalid JWT token, deleting.");
      this.deleteToken();
    }

    // check if token valid
    if(token && userData && !isExpired){

      this.setUser(userData);

    }	else {

      if(this.logged){
        if(isExpired) this.onExpired.next(this.user.value);
        else this.onLogout.next(this.user.value);
      }

      this.deleteToken();
      this.deleteUser();
    }
  }

  /*
	 * log out user 
	 */
  logout():boolean{

    // delete token from storage
    this.deleteToken();

    this.onLogout.next(this.user.value);

    this.deleteUser();

    // update user data
    this.refreshState();

    return !this.logged;
  }

  setUser(userData){

    // set user
    this.user.next(userData);

    // announce login to subscribers if applicable
    if(!this.logged) this.onLogin.next(this.user.value);

    this.logged = true;
  }

  deleteUser(){
    // token invalid or missing, so set empty token and user`
    this.logged = false;	
    this.user.next(null);
  }

}