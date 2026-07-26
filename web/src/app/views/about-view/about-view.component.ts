import { Component, OnInit, OnDestroy } from '@angular/core';

import { TitleService } from "app/services/title.service";

import { Contact } from "app/shared/schema/contact";
import { MenuService } from 'app/services/menu.service';

import { Contacts } from "config/contacts";
import { General } from "config/general";

@Component({
  selector: 'about-view',
  templateUrl: "about-view.component.html",
  styleUrls: ["about-view.component.scss"]
})
export class AboutViewComponent implements OnInit, OnDestroy {

  contacts: Contact[] = Contacts.leaders;

  mapUrl: string = General.homeMapUrl;

  constructor(
    private menuService: MenuService,
    private titleService: TitleService
  ) {
    this.menuService.setTransparent(true);
  }

  ngOnInit() {

    this.titleService.setPageTitle("O nás");
  }

  ngOnDestroy() {
    this.menuService.reset();
  }

  slideDown() {
    console.log("test");
  }

}
