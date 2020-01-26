import { Component, OnInit } from '@angular/core';
import { TitleService } from 'app/core/services/title.service';
import { MenuService } from 'app/core/services/menu.service';
import { UserService } from 'app/core/services/user.service';
import { Router } from '@angular/router';
import { LoginService } from 'app/core/services/login.service';

@Component({
  selector: 'admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminMenuComponent implements OnInit {

  collapsed: boolean = true;

  constructor(
    public titleService: TitleService,
    public menuService: MenuService,
    public userService: UserService,
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit() {
  }


  logout() {
    this.loginService.logout();
    this.router.navigate(["/"]);
  }

}
