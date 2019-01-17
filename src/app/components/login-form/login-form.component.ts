import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { LoginService } from "app/services/login.service";
import { ToastService } from "app/services/toast.service";

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  
  expired:boolean = false;
  
  loginValue:string = "";
  
  status:string = null;
  
  view:string = "login";

  constructor(
    private loginModal:BsModalRef,
    private router:Router,
    private toastService:ToastService,
    private loginService:LoginService
  ) { }
  
  async login(loginForm:NgForm){
    const result = await this.loginService.loginCredentials(loginForm.value);

    if(result.success){      
      this.loginModal.hide();
    }
    else{
      this.status = result.error;
    }
    
  }
  
  async loginGoogle(){
    const result = await this.loginService.loginGoogle();
    if(result){      
      this.loginModal.hide();
    }
    else{
      this.toastService.toast("Přihlášení se nezdařilo.")
    }
  }
  
  async sendLoginLink(linkForm:NgForm){
    this.status = "linkSending";
    const formData = linkForm.value;
    const result = await this.loginService.sendLoginLink(formData.login);
    if(result.success) this.status = "linkSent";
    else this.status = result.error;
  }
  
  close(){
    if(this.expired) this.router.navigate(["/"]);
    this.loginModal.hide();
  }
  

}
