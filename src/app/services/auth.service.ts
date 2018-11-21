import { Injectable, EventEmitter, ApplicationRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject }    from 'rxjs';

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
@Injectable()
export class AuthService {

  apiRoot:string = environment.apiRoot;

  public onLogin:BehaviorSubject<{user:AuthUser}> = new BehaviorSubject(null);
  public onLogout:BehaviorSubject<{user:AuthUser}> = new BehaviorSubject(null);
  public onExpired:BehaviorSubject<{user:AuthUser}> = new BehaviorSubject(null);

  // boolean if user is logged
  logged:boolean = false;

  // current token
  token:string = null;

  // current user (use blank user as default)
  user:AuthUser = new AuthUser;

  renewInterval:number;
  
  constructor(private http:HttpClient, private jwtHelper:JwtHelperService, applicationRef:ApplicationRef){

    // refresh user data to match token
    this.refreshState();

    // periodically renew token and check token validity
    applicationRef.isStable.subscribe((s) => { // https://github.com/angular/angular/issues/20970
      if (s) this.renewInterval = window.setInterval(() => this.renewToken(), 5 * 60 * 1000);
      else window.clearInterval(this.renewInterval);
    });
    
  }

  saveToken(token){
    return window.localStorage.setItem("id_token", token);
  }

  getToken(){
    return window.localStorage.getItem("id_token");	
  }

  deleteToken(){
    return window.localStorage.removeItem("id_token");
  }

  // get the token by credentials
  async login(credentials){

    // query the web api to get the token

    /* LOGIN */
    const token = await this.http.post(this.apiRoot + "/login", credentials, { responseType: 'text' }).toPromise();

    // save the token to storage
    this.saveToken(token);

    // update state to match token from storage
    this.refreshState();

    // if user is not logged at this step, token was invalid
    if(this.logged) return this.user;
    else throw new Error("Invalid token");

  }

  sendToken(userId:string):Promise<string>{
    return this.http.post(this.apiRoot + "/login/sendlink",{login:userId},{ responseType: "text" }).toPromise();
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

  async googleLogin(googleToken:string){

    const token = await this.http.post(this.apiRoot + "/login/google",{token:googleToken},{ responseType: "text" }).toPromise();

    // save the token to storage
    this.saveToken(token);

    // update state to match token from storage
    this.refreshState();

    // if user is not logged at this step, token was invalid
    if(this.logged) return this.user;
    else throw new Error("Invalid token");
  }

  /**
		* Tokens have limited time validity to avoid misues, however, we do not want user to be "logged out" while working with the application.
    * Therefore we have to renew this token from time to time.
		*/
  renewToken():void{

    // if we dont have token or it is expired, there is nothing to renew
    if(!this.token || this.jwtHelper.isTokenExpired(this.token)) return;

    // get the new token. as an authorization, we use current token
    this.http.get(this.apiRoot + "/login/renew", { responseType: 'text' }).toPromise()

      .then(token => {

      // save the token to storage
      this.saveToken(token);

      // update state to match token from storage
      this.refreshState();

    })

      .catch(err => {
      // on Unauthorized error delete token - access was lost
      if(err.code === 401){
        this.deleteToken();
        this.refreshState();
      }
    });
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

      // save the token
      this.token = token;

      // set user
      this.setUser(userData);

      // announce login to subscribers if applicable
      if(!this.logged) this.onLogin.next({ user: this.user });

      this.logged = true;

    }	else if(token) {

      if(this.logged){
        if(isExpired) this.onExpired.next({ user: this.user });
        else this.onLogout.next({ user: this.user });
      }

      this.deleteToken();
      this.deleteUser();
    }
    else{
      this.deleteUser();
    }
  }

  /*
	 * log out user 
	 */
  logout():boolean{

    // delete token from storage
    this.deleteToken();

    this.onLogout.next({ user: this.user });

    this.deleteUser();

    // update user data
    this.refreshState();

    return !this.logged;
  }

  setUser(userData:any){

    this.user = userData || new AuthUser();

    if(!this.user.roles) this.user.roles = [];

    this.user.roles.push("guest");
  }

  deleteUser(){
    // token invalid or missing, so set empty token and user
    this.token = null;
    this.logged = false;	
    this.setUser(null);
  }

}