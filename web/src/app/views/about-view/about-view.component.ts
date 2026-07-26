import { Component, OnInit, OnDestroy } from '@angular/core';

import { TitleService } from "app/services/title.service";

import { MenuService } from 'app/services/menu.service';

@Component({
  selector: 'about-view',
  templateUrl: "about-view.component.html",
  styleUrls: ["about-view.component.scss"]
})
export class AboutViewComponent implements OnInit, OnDestroy {

  mapUrl: string = "https://frame.mapy.cz/s/cefoluseru";

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
