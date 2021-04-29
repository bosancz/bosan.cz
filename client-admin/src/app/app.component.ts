import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular';
import * as packageJson from "app/../../package.json";
import { LoginService } from 'app/core/services/login.service';
import { UserService } from 'app/core/services/user.service';
import { map } from 'rxjs/operators';
import { AclService } from './core/services/acl.service';
import { ConfigService } from './core/services/config.service';

@Component({
  selector: 'bo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  environment$ = this.configService.config.pipe(map(config => config.general && config.general.environment));

  version = packageJson.version;

  constructor(
    private userService: UserService,
    private aclService: AclService,
    private loginService: LoginService,
    private configService: ConfigService,
    private router: Router,
    private menuController: MenuController,
    public platform: Platform
  ) {
    this.initUserService();

    this.initLoginService();
  }

  ngOnInit() {
  }

  private initUserService() {
    this.userService.loadUser();
  }

  private initLoginService() {
    this.loginService.onLogin.subscribe(() => {
      this.userService.loadUser();
    });
    this.loginService.onLogout.subscribe(() => {
      this.userService.loadUser();
    });
  }

  closeMenu() {
    this.menuController.close();
  }

}
