import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";

import { ConfigService } from "app/core/services/config.service";
import { ToastService } from "app/core/services/toast.service";
import { LayoutService } from "app/core/services/layout.service";
import { TitleService } from "app/core/services/title.service";

import { Contact } from "app/shared/schema/contact";

@Component({
  selector: 'about-view',
  templateUrl: "about-view.component.html",
  styleUrls: ["about-view.component.scss"]
})
export class AboutViewComponent implements OnInit, OnDestroy {
  
  contacts:Contact[] = [];
  
  mapUrl:string;

  constructor(private configService:ConfigService, private toastService:ToastService, private layoutService:LayoutService, private router:Router, private titleService:TitleService) {
    this.layoutService.menu.transparent = true;
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
    this.layoutService.menu.transparent = false;
  }
  
  slideDown(){
    console.log("test");
  }

}
