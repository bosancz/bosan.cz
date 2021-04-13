import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import * as packageJson from "app/../../package.json";
import { permissions } from "app/config/permissions";
import { LoginService } from 'app/core/services/login.service';
import { UserService } from 'app/core/services/user.service';
import { AclService } from 'lib/acl';
import { map } from 'rxjs/operators';
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
    private menuController: MenuController
  ) {
    this.loadPermissions();

    this.initUserService();

    this.initLoginService();
  }

  ngOnInit() {
    this.checkLogin();
  }

  loadPermissions() {
    this.aclService.setPermissions(permissions);
  }

  private async checkLogin() {
    const user = await this.userService.user.toPromise();

    if (!user) {
      this.router.navigate(["/login"]);
    }
    else {
      this.aclService.can("admin").toPromise().then(can => {
        if (!can) this.router.navigate(["/pristup-odepren"]);
      });
    }
  }

  private initUserService() {

    // update roles
    this.userService.user.subscribe(user => {
      if (user) this.aclService.setRoles(["guest", "user", ...user.roles]);
      else this.aclService.setRoles(["guest"]);
    });

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
