import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd, Params } from '@angular/router';
import { Observable } from 'rxjs';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { AuthService } from "./services/auth.service";
import { ACLService } from "./services/acl.service";
import { ToastService, Toast } from "./services/toast.service";
import { MenuService } from "./services/menu.service";
import { GoogleService } from "./services/google.service";

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

  constructor(public authService:AuthService, private aclService:ACLService, public toastService:ToastService, private modalService:BsModalService, public menuService:MenuService,private router:Router,private route:ActivatedRoute,  @Inject(AppConfig) private config:IAppConfig, private googleService:GoogleService){
    aclService.routes = config.acl.routes;
    aclService.default = config.acl.default;
  }

  ngOnInit(){
    
    // show toasts emitted by toastservice
    this.toastService.toasts.subscribe((toast:Toast) => {
      this.toasts.push(toast);
      setTimeout(() => this.toasts.shift(),2000);
    });
    
    this.initACLService();

    this.initAuthService();
    
    this.checkTokenLogin();
    
    this.checkGoogleLogin();
    
  }
  
  checkTokenLogin(){
    // if token provided (e.g. login link) save it and remove it from URL
    this.route.queryParams.subscribe((params:any) => {
      if(params.token){
        this.authService.loginToken(params.token);
        this.router.navigate(["/moje/admin/heslo"], { relativeTo: this.route });
        this.toastService.toast("Byl/a jsi přihlášen/a přes odkaz. Teď si nastav heslo.");
      }
    });
  }
  
  initACLService(){
    // show unauthorized messages from ACL
    this.aclService.unauthorized.subscribe(() => {
      if(this.authService.logged) this.toastService.toast("K této stránce nemáte právo přistupovat. Požádejte administrátora o udělení práv.","error");
      else this.toastService.toast("Pro přístup k této stránce musíte být přilášeni. Přihlaste se, prosím.","error");    
    });
  }
  
  initAuthService(){
    // handle login
    this.authService.onLogin.subscribe(event => {
      
      if(event === null) return;
      
      this.aclService.roles = ["guest","user",...event.user.roles];
      this.aclService.admin = event.user.roles.indexOf("admin") !== -1;
      
      console.log("Logged in as " + event.user._id + ", roles: " + this.aclService.roles.join(", "));
      
      this.toastService.toast("Přihlášeno.");
    });

    // handle logout
    this.authService.onLogout.subscribe(event => {
      
      if(event === null) return;

      this.aclService.roles = ["guest"];
      this.aclService.admin = false;

      this.expiredLogin = false;
      this.toastService.toast("Odhlášeno.");
      this.router.navigate(["/"]);
      
      this.googleService.signOut();
    });
    
    this.authService.onExpired.subscribe(event => {
      
      if(event === null) return;
      
      this.aclService.roles = ["guest"];
      this.aclService.admin = false;
      
      this.toastService.toast("Přihlášení vypršelo, přihlas se znovu.");
      this.expiredLogin = true;
      this.openLogin();
      
      this.googleService.signOut();
    });
  }
  
  async checkGoogleLogin(){
    var auth2 = await this.googleService.auth2;

    var signedIn:boolean = auth2.isSignedIn.get();
    
    console.log("Checking google login... " + (signedIn ? "signed in." : "not signed in."));
    if(signedIn){
      try{
        let profile = auth2.currentUser.get().getBasicProfile();
        console.log("Google user:",profile.getEmail());
        let token:string = auth2.currentUser.get().getAuthResponse(true).id_token;
        await this.authService.googleLogin(token); 
      } catch(err){
        console.log(err);
      }
    }
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
