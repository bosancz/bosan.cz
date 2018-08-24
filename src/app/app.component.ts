import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { AuthService } from "./services/auth.service";
import { ToastService, Toast } from "./services/toast.service";
import { MenuService } from "./services/menu.service";

import { LoginFormComponent } from './components/login-form/login-form.component';

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
  
  constructor(public authService:AuthService, public toastService:ToastService, private modalService:BsModalService, public menuService:MenuService,private router:Router,private route:ActivatedRoute){
  }
  
  ngOnInit(){
    this.toastService.toasts.subscribe((toast:Toast) => {
      this.toasts.push(toast);
      setTimeout(() => this.toasts.shift(),2000);
    });
    
    this.authService.onLogout.subscribe(event => {
      if(event.expired){
        this.toastService.toast("Přihlášení vypršelo, přihlas se znovu.");
        this.openLogin();
      }
      else{
        this.toastService.toast("Odhlášeno.");
        this.router.navigate(["/"]);
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
