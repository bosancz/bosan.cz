import { Component, OnInit } from '@angular/core';

import { permissions } from "config/permissions";
import { UserService } from './core/services/user.service';
import { AclService } from 'lib/acl';
import { LoginService } from './core/services/login.service';

@Component({
  selector: 'bosan-app',
  template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {

  constructor(    
    private userService: UserService,
    private aclService: AclService,
    private loginService: LoginService
  ) {
    this.loadPermissions();

    this.initUserService();

    this.initLoginService();
  }

  ngOnInit() {

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


}
