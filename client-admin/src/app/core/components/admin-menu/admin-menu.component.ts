import { Component, OnInit } from '@angular/core';
import { TitleService } from 'app/core/services/title.service';
import { MenuService } from 'app/core/services/menu.service';
import { UserService } from 'app/core/services/user.service';
import { Router } from '@angular/router';
import { LoginService } from 'app/core/services/login.service';
import { ConfigService } from 'app/core/services/config.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminMenuComponent implements OnInit {

  collapsed: boolean = true;

  dropdownsCollapsed = {
    program: true
  };

  environment$ = this.configService.config.pipe(map(config => config.general && config.general.environment));

  constructor(
    public titleService: TitleService,
    public menuService: MenuService,
    public userService: UserService,
    private loginService: LoginService,
    private configService: ConfigService,
    private router: Router
  ) { }

  ngOnInit() {
  }


  logout() {
    this.loginService.logout();
    this.router.navigate(["/login"]);
  }

}
