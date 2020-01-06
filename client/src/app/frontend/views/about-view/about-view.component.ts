import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";

import { ConfigService } from "app/core/services/config.service";
import { ToastService } from "app/core/services/toast.service";
import { TitleService } from "app/core/services/title.service";

import { Contact } from "app/shared/schema/contact";
import { MenuService } from 'app/core/services/menu.service';

@Component({
  selector: 'about-view',
  templateUrl: "about-view.component.html",
  styleUrls: ["about-view.component.scss"]
})
export class AboutViewComponent implements OnInit, OnDestroy {

  contacts: Contact[] = [];

  mapUrl: string;

  constructor(
    private configService: ConfigService,
    private menuService: MenuService,
    private titleService: TitleService
  ) {
    this.menuService.setTransparent(true);
  }

  ngOnInit() {

    this.titleService.setPageTitle("O nás");

    this.loadConfig();
  }

  loadConfig() {
    this.configService.getConfig().then(config => {
      this.contacts = config.contacts.leaders;
      this.mapUrl = config.general.homeMapUrl;
    });
  }

  ngOnDestroy() {
    this.menuService.reset();
  }

  slideDown() {
    console.log("test");
  }

}
