import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { permissions } from "app/config/permissions";
import { LoginService } from 'app/core/services/login.service';
import { MenuService } from 'app/core/services/menu.service';
import { OnlineService } from 'app/core/services/online.service';
import { UserService } from 'app/core/services/user.service';
import { AclService } from 'lib/acl';


@Component({
  selector: 'bo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    public onlineService: OnlineService,
    public swUpdate: SwUpdate,
    public menuService: MenuService,

    private userService: UserService,
    private aclService: AclService,
    private loginService: LoginService,

    private router: Router,
    private route: ActivatedRoute
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

  reload() {
    window.location.reload();
  }

  async checkLogin() {
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
