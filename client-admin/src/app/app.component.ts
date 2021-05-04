import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular';
import * as packageJson from "app/../../package.json";
import { LoginService } from 'app/core/services/login.service';
import { UserService } from 'app/core/services/user.service';
import { filter, map, mergeMap } from 'rxjs/operators';
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

  splitPaneWhen: boolean | string = false;

  constructor(
    private userService: UserService,
    private aclService: AclService,
    private loginService: LoginService,
    private configService: ConfigService,
    private route: ActivatedRoute,
    private router: Router,
    private menuController: MenuController,
    public platform: Platform
  ) {
    this.initUserService();

    this.initLoginService();
  }

  ngOnInit() {
    // get data of current child route
    const routeData = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.rootRoute(this.route)),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data)
      );

    // hide menu on some pages (e.g. login page)
    routeData.subscribe(data => {

      if (data.hideMenu) this.splitPaneWhen = false;
      else this.splitPaneWhen = "lg";

    });
  }

  private rootRoute(route: ActivatedRoute) {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
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
