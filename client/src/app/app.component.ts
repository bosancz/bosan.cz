import { Component, OnInit } from '@angular/core';

import { ToastService, Toast } from "app/core/services/toast.service";

import { permissions } from "config/permissions";
import { UserService } from './core/services/user.service';
import { AclService } from 'lib/acl';
import { LoginService } from './core/services/login.service';

@Component({
  selector: 'bosan-app',
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"]
})
export class AppComponent implements OnInit {

  toasts: Toast[] = [];

  isScrollTop: boolean;

  constructor(    
    private toastService: ToastService,

    private userService: UserService,
    private aclService: AclService,
    private loginService: LoginService
  ) {
    this.loadPermissions();

    this.initUserService();

    this.initLoginService();
  }

  ngOnInit() {
    this.toastService.toasts.subscribe((toast: Toast) => {
      this.toasts.push(toast);
      setTimeout(() => this.toasts.shift(), 2000);
    });

  }

  loadPermissions() {
    this.aclService.setPermissions(permissions);
  }

  initUserService() {
    
    // update roles
    this.userService.user.subscribe(user => {
      if (user) this.aclService.setRoles(["guest", "user", ...user.roles]);
      else this.aclService.setRoles(["guest"]);
    });
    
    this.userService.loadUser();

  }

  initLoginService() {
    this.loginService.onLogin.subscribe(() => {
      this.userService.loadUser();      
    });
    this.loginService.onLogout.subscribe(() => {
      this.userService.loadUser();      
    });
  }

  clearToasts() {
    this.toasts = [];
  }

}
