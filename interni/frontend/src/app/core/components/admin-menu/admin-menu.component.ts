import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { NavController, Platform } from '@ionic/angular';

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
    private navController: NavController,
    public onlineService: OnlineService,
    public swUpdate: SwUpdate,
    public platform: Platform,
  ) { }

  ngOnInit() {
  }


  async logout() {
    await this.loginService.logout();
    if (this.userService.userSnapshot?._id) {
      this.navController.navigateRoot("/");
    }
    else {
      this.navController.navigateRoot("/login");
    }
  }

  reload() {
    window.location.reload();
  }

}
