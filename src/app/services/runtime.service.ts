import { Injectable, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { UserService } from "app/services/user.service";
import { ApiService } from "app/services/api.service";
import { AuthService } from "app/services/auth.service";
import { LoginService } from "app/services/login.service";
import { GoogleService } from "app/services/google.service";

import { ToastService } from "app/services/toast.service";

import { AclService } from "app/lib/acl";

import { LoginFormComponent } from "app/components/login-form/login-form.component";

import { permissions } from "config/permissions";

@Injectable({
  providedIn: 'root'
})
export class RuntimeService {
  
  loginModal:BsModalRef;

  constructor(
    private api:ApiService,
    private userService:UserService,
    private aclService:AclService,
    private modalService:BsModalService,
    private googleService:GoogleService,
    private authService:AuthService,
    private loginService:LoginService,
    private toastService:ToastService
  ) { }

  init(){
    
    this.loadPermissions();

    this.initUserService();
    
    this.initAuthService();
    
    this.initLoginService();
    
  }

  loadPermissions(){
    this.aclService.setPermissions(permissions);
    this.aclService.setRoles(["guest"]);
  }
  
  initUserService(){
    // update roles
    this.userService.user.subscribe(user => {
      if(user) this.aclService.setRoles(["guest","user",...user.roles]);
      else this.aclService.setRoles(["guest"]);
    });
  }
  
  initLoginService(){
    this.loginService.onLogin.subscribe(() => this.toastService.toast("Přihlášeno."));
    this.loginService.onLogout.subscribe(() => this.toastService.toast("Odhlášeno."));
  }

  initAuthService(){

    // update current user information on token change
    this.authService.onUpdate.subscribe(() => {
      this.userService.loadUser();
    });

    // on expired tokens show login screen
    this.authService.onExpired.subscribe(event => {
      this.loginModal = this.modalService.show(LoginFormComponent, { initialState: { expired: true }, keyboard: false, ignoreBackdropClick: true });
      this.googleService.signOut();
    });
  }

}
