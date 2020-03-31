import { Component, OnInit, OnDestroy } from '@angular/core';

import { ConfigService } from "app/services/config.service";
import { TitleService } from "app/services/title.service";

import { Contact } from "app/shared/schema/contact";
import { MenuService } from 'app/services/menu.service';

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
