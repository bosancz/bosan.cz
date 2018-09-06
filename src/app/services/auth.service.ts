import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject }    from 'rxjs';

import { JwtHelperService } from '@auth0/angular-jwt';

import { User } from "../schema/user";

import { DataService } 		from './data.service';

export class AuthUser{
  _id:string;
  member?:any;
  roles:string[] = [];
}

/**
	* Service to save user information and commnicate user data with server
	*/
@Injectable()
export class AuthService {

	public onLogin = new Subject<{user:AuthUser}>();
  public onLogout = new Subject<{user:AuthUser,reason:string}>();

	// boolean if user is logged
	logged: boolean = false;

 	// current token
	token: string = null;

	// current user (use blank user as default)
	user: AuthUser = new AuthUser;

	constructor(private http: HttpClient, private jwtHelper:JwtHelperService){
		
		// refresh user data to match token
		this.refreshState()
		
		// periodically renew token and check token validity
		setInterval(() => this.renewToken(), 5 * 60 * 1000);
    setInterval(() => this.refreshState(), 5 * 1000);
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
    let token = await this.dataService.login(credentials)

    //save the token to storage
    this.saveToken(token);

    // update state to match token from storage
    this.refreshState();

    // if user is not logged at this step, token was invalid
    if(this.logged) return this.user;
    else throw new Error("Invalid token");

	}

	/**
		* Tokens have limited time validity to avoid misues, however, we do not want user to be "logged out" while working with the application. Therefore we have to renew this token from time to time.
		*/
	renewToken():void{
		
		// if we dont have token or it is expired, there is nothing to renew
		if(!this.token || this.jwtHelper.isTokenExpired(this.token)) return;
		
		// get the new token. as an authorization, we use current token
		this.http.get("/api/login/renew", { responseType: 'text' }).toPromise()

			.then(token => {

				//save the token to storage
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
		var token = this.getToken();
    
    try{
      var userData = this.jwtHelper.decodeToken(token);
    }
    catch(err) {
      console.error("Invalid JWT token, deleting.");
      this.deleteToken();
    }
    
		// check if token valid
		if(token && userData && !this.jwtHelper.isTokenExpired(token)){
			
			// save the token
			this.token = token;
			
			// set user
			this.setUser(userData);
			
			// announce login to subscribers if applicable
			if(!this.logged) this.onLogin.next({
        user: this.user
      });
			
			this.logged = true;
			
		}	else {
      
      if(this.logged){
        if(this.jwtHelper.isTokenExpired(token)) this.onLogout.next({ user: this.user, reason: "expired" });
        if(!userData) this.onLogout.next({ user: this.user, reason: "invalid" });
      }
			
      this.deleteUser();

		}
	}

	/*
	 * log out user 
	 */
	logout():boolean{
		
		// delete token from storage
		this.deleteToken();

    this.onLogout.next({
      user: this.user,
      reason: "logout"
    });

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