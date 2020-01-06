import { Component, OnInit, OnDestroy } from '@angular/core';

import { ConfigService } from "app/core/services/config.service";
import { TitleService } from "app/core/services/title.service";
import { MenuService } from 'app/core/services/menu.service';

@Component({
  selector: 'camp-view',
  templateUrl: './camp-view.component.html',
  styleUrls: ['./camp-view.component.scss']
})
export class CampViewComponent implements OnInit, OnDestroy {

  mapUrl: string;

  constructor(
    private menuService: MenuService,
    private titleService: TitleService,
    private configService: ConfigService
  ) {
    this.menuService.setTransparent(true);
  }

  ngOnInit() {
    this.titleService.setPageTitle("Tábor");

    this.loadMapUrl();
  }

  ngOnDestroy() {
    this.menuService.reset();
  }

  loadMapUrl() {
    this.configService.getConfig().then(config => {
      this.mapUrl = config.general.campMapUrl;
    });
  }

}
