import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { TitleService } from "app/core/services/title.service";
import { LayoutService } from "app/core/services/layout.service";  
import { ToastService } from "app/core/services/toast.service";

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private titleService:TitleService, private layoutService:LayoutService, private toastService:ToastService, private router:Router) { }

  ngOnInit() {
    this.titleService.setTitle("Můj Bošán");
    this.layoutService.hideFooter(true);
  }
  
  ngOnDestroy(){
    this.layoutService.hideFooter(false);
  }

}
