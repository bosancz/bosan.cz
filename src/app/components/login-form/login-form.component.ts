import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { AuthService } from "app/services/auth.service";
import { ApiService } from "app/services/api.service";
import { ToastService } from "app/services/toast.service";
import { GoogleService } from "app/services/google.service";

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  
  expired:boolean = false;
  
  loginValue:string = "";
  
  status:string = null;
  error:Error;
  
  sendLink:boolean = false;
  
  googleLoaded:boolean = false;

  constructor(
    public loginModal:BsModalRef,
    private authService:AuthService,
    private api:ApiService,
    private router:Router,
    private toastService:ToastService,
    private googleService:GoogleService
  ) { }

  ngOnInit() {
    this.googleService.loaded.subscribe(loaded => this.googleLoaded = loaded);
  }
  
  async login(loginForm:NgForm){
    
    this.status = null;
    
    const credentials = loginForm.value;

    try{
      
      const response = await this.api.post("login", credentials);
      
      this.authService.loginToken(response.body);
      
      this.toastService.toast("Přihlášeno.")
      
      this.loginModal.hide();
      this.router.navigate(["/interni"]);
    }
    catch(err){
      if(err.status === 401) this.status = "invalidCredentials";
      else if(err.status === 503) this.status = "credentialsLoginNotAvalible";
      else throw err;
    }
  }
  
  async googleLogin(){
    
    try{
      const googleToken = await this.googleService.signIn();
      
      const response = await this.api.post("login:google",{token:googleToken});
      
      this.authService.loginToken(response.body);      
      
      this.toastService.toast("Přihlášeno.")
    }
    catch(err){
      this.toastService.toast("Přihlášení přes Google se nezdařilo.");
    }
    
    this.loginModal.hide();
    
  }
  
  async loginLink(form:NgForm){
    
    const formData = form.value;
    
    try{
      
      this.status = null;
      
      await this.api.post("login:sendlink",formData);
      
      this.status = "linkSent";
      
    }
    catch(err){
      if(err.status === 404) this.status = "userNotFound";
      else {
        this.status = "error";
        this.error = err;
      }
    }
    
  }
  

}
