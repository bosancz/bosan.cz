import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { TitleService } from "app/services/title.service";
import { LayoutService } from "app/services/layout.service";  
import { ToastService } from "app/services/toast.service";

@Component({
  selector: 'personal-admin',
  templateUrl: './personal-admin.component.html',
  styleUrls: ['./personal-admin.component.scss']
})
export class PersonalAdminComponent implements OnInit {

  constructor(private titleService:TitleService, private layoutService:LayoutService, private toastService:ToastService, private router:Router) { }

  ngOnInit() {
    this.titleService.setTitle("Můj Bošán");
    this.layoutService.hideFooter(true);
  }
  
  ngOnDestroy(){
    this.layoutService.hideFooter(false);
  }

}
