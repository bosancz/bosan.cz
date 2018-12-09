import { Component, HostListener, AfterViewInit, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { LayoutService } from "app/services/layout.service";
import { OnlineService } from "app/services/online.service";
import { AuthService } from "app/services/auth.service";
import { AclService } from "app/lib/acl/services/acl.service";
import { ConfigService } from "app/services/config.service";
import { ToastService } from "app/services/toast.service";

import { LoginFormComponent } from "app/components/login-form/login-form.component";

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

  constructor(
    public aclService:AclService,
    public authService:AuthService,
    public layoutService:LayoutService,
    public onlineService:OnlineService,
    private configService:ConfigService,
    private modalService:BsModalService,
    private toastService:ToastService,
    private router:Router
  ) { }

  ngOnInit(){
    this.configService.config.subscribe(config => {
      this.environment = config.general.environment;
    });
    this.authService.user.subscribe(user => this.userLogin = user ? user.login : "");
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
    this.loginModal = this.modalService.show(LoginFormComponent, {});
  }
  
  updateAccountDropdown(dropdown){
    dropdown.isOpen = !this.layoutService.menu.collapsed;
  }

  logout(){
    this.authService.logout();
    this.toastService.toast("Odhlášeno.");
    this.router.navigate(["/"]);
  }

}
