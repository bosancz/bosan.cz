import { Component, OnInit, OnDestroy } from '@angular/core';

import { TitleService } from "app/services/title.service";
import { MenuService } from 'app/services/menu.service';

import { General } from "config/general";

@Component({
  selector: 'camp-view',
  templateUrl: './camp-view.component.html',
  styleUrls: ['./camp-view.component.scss']
})
export class CampViewComponent implements OnInit, OnDestroy {

  mapUrl: string = General.campMapUrl;

  constructor(
    private menuService: MenuService,
    private titleService: TitleService
  ) {
    this.menuService.setTransparent(true);
  }

  ngOnInit() {
    this.titleService.setPageTitle("Tábor");
  }

  ngOnDestroy() {
    this.menuService.reset();
  }

}
