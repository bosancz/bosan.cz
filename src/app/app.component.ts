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
  templateUrl: "app.template.html",
  styleUrls: ["app.style.css"]
})
export class AppComponent {
  
  isMenuTransparent:boolean;
  
  isMenuCollapsed:boolean = true;
  
  loginModal: BsModalRef;
  
  constructor(public authService:AuthService, public toastService:ToastService, private modalService:BsModalService, public menuService:MenuService,private router:Router,private route:ActivatedRoute){
  }
  
  ngOnInit(){
  }
  
  openLogin() {
    this.loginModal = this.modalService.show(LoginFormComponent, {});
  }
  
  logout(){
    this.authService.logout();
    this.router.navigate(["/"]);
  }
}
