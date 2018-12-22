import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { TitleService } from "app/services/title.service";
import { LayoutService } from "app/services/layout.service";  
import { AuthService } from "app/services/auth.service";
import { ToastService } from "app/services/toast.service";

@Component({
  selector: 'personal-admin',
  templateUrl: './personal-admin.component.html',
  styleUrls: ['./personal-admin.component.scss']
})
export class PersonalAdminComponent implements OnInit {

  constructor(private titleService:TitleService, private layoutService:LayoutService, public authService:AuthService, private toastService:ToastService, private router:Router) { }

  ngOnInit() {
    this.titleService.setTitle("Můj Bošán");
    this.layoutService.hideFooter(true);
  }
  
  ngOnDestroy(){
    this.layoutService.hideFooter(false);
  }
  
  
  logout(){
    this.authService.logout();
    this.toastService.toast("Odhlášeno.");
    this.router.navigate(["/"]);
  }

}
