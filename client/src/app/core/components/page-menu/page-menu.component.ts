import { Component, HostListener, AfterViewInit, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { LayoutService } from "app/core/services/layout.service";
import { LoginService } from "app/core/services/login.service";
import { OnlineService } from "app/core/services/online.service";
import { UserService } from "app/core/services/user.service";
import { AclService } from "lib/acl";
import { ConfigService } from "app/core/services/config.service";
import { ToastService } from "app/core/services/toast.service";
import { TitleService } from 'app/core/services/title.service';

import { LoginFormComponent } from "app/shared/components/login-form/login-form.component";


@Component({
  selector: 'page-menu',
  templateUrl: './page-menu.component.html',
  styleUrls: ['./page-menu.component.scss']
})
export class PageMenuComponent implements AfterViewInit, OnInit {

  loginModal:BsModalRef;
  
  isTop:boolean = true;

  environment:string;
  
  userLogin:string;

  subTitle:Observable<string>;

  constructor(
    public aclService:AclService,
    public userService:UserService,
    public layoutService:LayoutService,
    public onlineService:OnlineService,
    public titleService:TitleService,
    private loginService:LoginService,
    private configService:ConfigService,
    private modalService:BsModalService,
    private toastService:ToastService,
    private router:Router,
  ) { }

  ngOnInit(){
    this.configService.config.subscribe(config => {
      this.environment = config.general.environment;
    });

    this.subTitle = this.titleService.subTitle.pipe(debounceTime(0));

    this.userService.user.subscribe(user => this.userLogin = user ? user.login : "");
  }

  ngAfterViewInit(){
    this.updateTop();
  }

  @HostListener('window:scroll', [])
  updateTop(){
    const doc = document.documentElement;
    const top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    this.isTop = (top === 0);
  }

  openLogin() {
    this.loginModal = this.modalService.show(LoginFormComponent);
  }
  
  updateAccountDropdown(dropdown){
    dropdown.isOpen = !this.layoutService.menu.collapsed;
  }

  logout(){
    this.loginService.logout();
    this.router.navigate(["/"]);
  }

}
