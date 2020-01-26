import { Component, HostListener, AfterViewInit, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { LoginService } from "app/core/services/login.service";
import { OnlineService } from "app/core/services/online.service";
import { UserService } from "app/core/services/user.service";
import { AclService } from "lib/acl";
import { ConfigService } from "app/core/services/config.service";
import { ToastService } from "app/core/services/toast.service";
import { TitleService } from 'app/core/services/title.service';

import { LoginFormComponent } from "app/shared/modals/login-form/login-form.component";
import { MenuService } from 'app/core/services/menu.service';


@Component({
  selector: 'page-menu',
  templateUrl: './page-menu.component.html',
  styleUrls: ['./page-menu.component.scss']
})
export class PageMenuComponent implements AfterViewInit, OnInit {

  isTop: boolean = true;

  environment: string;

  collapsed: boolean = true;

  constructor(
    public aclService: AclService,
    public userService: UserService,
    public menuService: MenuService,
    public onlineService: OnlineService,
    public titleService: TitleService,
    private configService: ConfigService,
  ) { }

  ngOnInit() {
    this.configService.config.subscribe(config => {
      this.environment = config.general.environment;
    });
  }

  ngAfterViewInit() {
    this.updateTop();
  }

  @HostListener('window:scroll', [])
  updateTop() {
    const doc = document.documentElement;
    const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    this.isTop = (top === 0);
  }

}
