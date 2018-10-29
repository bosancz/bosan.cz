import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";

import { ConfigService } from "app/services/config.service";
import { ToastService } from "app/services/toast.service";
import { MenuService } from "app/services/menu.service";
import { TitleService } from "app/services/title.service";

import { Contact } from "app/schema/contact";

@Component({
  selector: 'about-view',
  templateUrl: "about-view.component.html",
  styleUrls: ["about-view.component.css"]
})
export class AboutViewComponent implements OnInit, OnDestroy {
  
  contacts:Contact[] = [];
  
  mapUrl:string;

  constructor(private configService:ConfigService, private toastService:ToastService, private menuService:MenuService, private router:Router, private titleService:TitleService) {
    this.menuService.transparent = true;
  }

  ngOnInit() {
    
    this.titleService.setTitle("O nás");
    
    this.loadConfig();
  }
  
  loadConfig(){
    this.configService.getConfig().then(config => {
      this.contacts = config.contacts.leaders;
      this.mapUrl = config.general.homeMapUrl;
    });
  }

  ngOnDestroy(){
    this.menuService.transparent = false;
  }
  
  slideDown(){
    console.log("test");
  }

}
