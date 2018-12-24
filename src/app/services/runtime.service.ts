import { Injectable, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ApiService } from "app/services/api.service";
import { AuthService } from "app/services/auth.service";
import { ToastService, Toast } from "app/services/toast.service";
import { GoogleService } from "app/services/google.service";

import { AclService } from "app/lib/acl/services/acl.service";

import { LoginFormComponent } from "app/components/login-form/login-form.component";

import { permissions } from "config/permissions";

@Injectable({
  providedIn: 'root'
})
export class RuntimeService {
  
  loginModal:BsModalRef;

  constructor(
  private api:ApiService,
   private aclService:AclService,
   private modalService:BsModalService,
   private toastService:ToastService,
   private googleService:GoogleService,
   private ngZone:NgZone,
   private router:Router,
   private route:ActivatedRoute,
   public authService:AuthService
  ) { }

  init(){

    // show toasts emitted by toastservice

    this.loadPermissions();

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

  loadPermissions(){
    this.aclService.setPermissions(permissions);
    this.aclService.setRoles(["guest"]);
  }

  initAuthService(){
    // update roles
    this.authService.user.subscribe(user => {
      if(user) this.aclService.setRoles(["guest","user",...user.roles]);
      else this.aclService.setRoles(["guest"]);
    });

    // update login
    this.ngZone.runOutsideAngular(() => { // https://github.com/angular/angular/issues/20970
      window.setInterval(() => {
        this.ngZone.run(() => {
          if(this.authService.logged){
            this.api.post("login:renew").then(response => {
              this.authService.loginToken(response.body);
            });
          }
        });
      }, 5 * 60 * 1000);
    });

    // handle logout
    this.authService.onLogout.subscribe(user => {
      this.googleService.signOut();
    });

    this.authService.onExpired.subscribe(event => {
      this.loginModal = this.modalService.show(LoginFormComponent, { initialState: { expired: true }, keyboard: false, ignoreBackdropClick: true });
      this.googleService.signOut();
    });
  }

  checkGoogleLogin(){

    this.googleService.loaded.subscribe(async () => {

      try{
        
        const googleUser:any = await this.googleService.getCurrentUser();

        if(googleUser){

          console.log("GoogleService: Logged in as " + googleUser.email);

          const response = await this.api.post("login:google",{token:googleUser.token});

          this.authService.loginToken(response.body);
        }

      } catch(err){
        console.log(err);
      }
    });

  }

}
