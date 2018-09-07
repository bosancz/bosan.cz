import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { AuthService } from "./services/auth.service";
import { ACLService } from "./services/acl.service";
import { ToastService, Toast } from "./services/toast.service";
import { MenuService } from "./services/menu.service";

import { LoginFormComponent } from './components/login-form/login-form.component';

import { AppConfig, IAppConfig } from "../config/config";

@Component({
  selector: 'app-root',
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"]
})
export class AppComponent {

  isMenuTransparent:boolean;

  isMenuCollapsed:boolean = true;

  loginModal: BsModalRef;

  toasts:Toast[] = [];
  
  navigationTrigger:string; // used to save why navigation happened until navigation end to decide if scroll to top
  navigationScroll:number[] = [];
  
  expiredLogin:boolean;

  constructor(public authService:AuthService, private aclService:ACLService, public toastService:ToastService, private modalService:BsModalService, public menuService:MenuService,private router:Router,private route:ActivatedRoute,  @Inject(AppConfig) private config:IAppConfig){
    aclService.routes = config.acl.routes;
    aclService.default = config.acl.default;
  }

  ngOnInit(){
    this.toastService.toasts.subscribe((toast:Toast) => {
      this.toasts.push(toast);
      setTimeout(() => this.toasts.shift(),2000);
    });
    
    this.aclService.unauthorized.subscribe(() => {
      if(this.authService.logged) this.toastService.toast("K této stránce nemáte právo přistupovat. Požádejte administrátora o udělení práv.","error");
      else this.toastService.toast("Pro přístup k této stránce musíte být přilášeni. Přihlaste se, prosím.","error");    

    });

    this.authService.onLogin.subscribe(event => {
      if(!event) return;
      this.aclService.roles = ["guest","user",...event.user.roles];
      this.aclService.admin = event.user.roles.indexOf("admin") !== -1;
    });
    
    this.authService.onLogout.subscribe(event => {
      
      if(!event) return;
      
      this.aclService.roles = ["guest"];
      this.aclService.admin = false;
      
      if(event.reason === "expired"){
        this.toastService.toast("Přihlášení vypršelo, přihlas se znovu.");
        this.expiredLogin = true;
        this.openLogin();
      }
      else{
        this.toastService.toast("Odhlášeno.");
        this.router.navigate(["/"]);
      }
    });
    
    this.modalService.onHide.subscribe(e => {
      if(this.expiredLogin && !this.authService.logged){
        this.router.navigate(["/"]);
        this.expiredLogin = false;
      }
    });
    
  }

  clearToasts(){
    this.toasts = [];
  }

  openLogin() {
    this.loginModal = this.modalService.show(LoginFormComponent, {});
  }

  logout(){
    this.authService.logout();
  }
}
