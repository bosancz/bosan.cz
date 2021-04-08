import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { Platform } from '@ionic/angular';

import { LoginService } from 'app/core/services/login.service';
import { MenuService } from 'app/core/services/menu.service';
import { OnlineService } from 'app/core/services/online.service';
import { TitleService } from 'app/core/services/title.service';
import { UserService } from 'app/core/services/user.service';

@Component({
  selector: 'admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminMenuComponent implements OnInit {

  submenu?: string;



  dropdownsCollapsed = {
    program: true
  };

  constructor(
    public titleService: TitleService,
    public menuService: MenuService,
    public userService: UserService,
    private loginService: LoginService,
    private router: Router,
    public onlineService: OnlineService,
    public swUpdate: SwUpdate,
    public platform: Platform,
  ) { }

  ngOnInit() {
  }


  async logout() {
    await this.loginService.logout();
    this.router.navigate(["/login"]);
  }

  reload() {
    window.location.reload();
  }

}
