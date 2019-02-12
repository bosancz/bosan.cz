import { Injectable } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { UserService } from "app/core/services/user.service";
import { LoginService } from "app/core/services/login.service";
import { GoogleService } from "app/core/services/google.service";

import { ToastService } from "app/core/services/toast.service";

import { AclService } from "lib/acl";

import { LoginFormComponent } from "app/shared/components/login-form/login-form.component";

import { permissions } from "config/permissions";

@Injectable({
  providedIn: 'root'
})
export class RuntimeService {
  
  loginModal:BsModalRef;
  
  logged:boolean = false;
  
  constructor(
    private userService:UserService,
    private aclService:AclService,
    private modalService:BsModalService,
    private googleService:GoogleService,
    private loginService:LoginService,
    private toastService:ToastService
  ) { }

  init(){
    
    this.loadPermissions();

    this.initUserService();
    
    this.initLoginService();
    
  }

  loadPermissions(){
    this.aclService.setPermissions(permissions);
  }
  
  initUserService(){
    
    this.userService.loadUser();
    
    // update roles
    this.userService.user.subscribe(user => {
      if(user) this.aclService.setRoles(["guest","user",...user.roles]);
      else this.aclService.setRoles(["guest"]);
    });
  }
  
  initLoginService(){
    this.loginService.onLogin.subscribe(() => {
      this.userService.loadUser();
      this.toastService.toast("Přihlášeno.")
    });
    this.loginService.onLogout.subscribe(() => {
      this.userService.loadUser();
      this.toastService.toast("Odhlášeno.")
    });
  }
  
  login(expired){
    this.loginModal = this.modalService.show(LoginFormComponent, { initialState: { expired: expired }, keyboard: false, ignoreBackdropClick: true });
    this.googleService.signOut();
  }

}
