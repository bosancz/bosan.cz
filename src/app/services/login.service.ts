import { Injectable, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { AuthService } from "app/services/auth.service";
import { ApiService } from "app/services/api.service";
import { GoogleService } from "app/services/google.service";

export interface LoginResult {
  success:boolean;
  error?:string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  onLogin:EventEmitter<void> = new EventEmitter();
  onLogout:EventEmitter<void> = new EventEmitter();

  constructor(
    private api:ApiService,
    private authService:AuthService,
    private route:ActivatedRoute,
    private router:Router,
    private googleService:GoogleService
  ) {
    this.checkTokenLogin();
  }

  checkTokenLogin(){
    // if token provided (e.g. login link) save it and remove it from URL
    this.route.queryParams.subscribe((params:any) => {
      if(params.token) this.loginToken(params.token);
    });
  }
  
  async loginCredentials(credentials):Promise<LoginResult>{
    
    const result:LoginResult = { success: true };
    
    try{

      const response = await this.api.post("login", credentials);
      const tokens = JSON.parse(response.body);
      
      this.authService.setTokens(tokens);
      
      this.onLogin.emit();
    }
    catch(err){
      result.success = false;
      
      if(err.status === 401) result.error = "invalidCredentials";
      else if(err.status === 503) result.error = "credentialsLoginNotAvalible";
      else throw err;
    }
    
    return result;

  }
  
  async loginGoogle():Promise<LoginResult>{
    
    try{
      // get google token
      const googleToken = await this.googleService.signIn();
      
      // validate token with the server
      const response = await this.api.post("login:google",{token:googleToken});
      
      // save resulting tokens
      this.authService.setTokens(JSON.parse(response.body));
      
      this.onLogin.emit();
      
      return { success: true };
    }
    catch(err){
      return { success: false };
    }
    
  }
  
  async loginToken(token:string){
    this.authService.setTokens({access_token: token});
    this.onLogin.emit();
    this.router.navigate(["./"], { relativeTo: this.route });
  }
  
  async loginImpersonate(userId:string){
    try{
      const response = await this.api.post("login:impersonate", { id: userId })
      
      this.authService.setTokens(JSON.parse(response.body));
      
      this.onLogin.emit();
      
      return { success: true };
    }
    catch(err) {
      return { success: false, error: err.message };
    }
  }
  
  async sendLoginLink(login:string):Promise<LoginResult>{
    const result:LoginResult = { success: true };
    
    try{
      await this.api.post("login:sendlink",{ login });
    }
    catch(err){
      result.success = false;
      if(err.status === 404) result.error = "userNotFound";
      else result.error = "error";
    }
    
    return result;
  }
  
  logout(){
    this.authService.deleteTokens();
    
    this.onLogout.emit();
  }
  
}