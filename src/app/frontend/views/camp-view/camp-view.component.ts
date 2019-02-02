import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from "@angular/router";

import { ConfigService } from "app/core/services/config.service";
import { LayoutService } from "app/core/services/layout.service";
import { TitleService } from "app/core/services/title.service";

@Component({
  selector: 'camp-view',
  templateUrl: './camp-view.component.html',
  styleUrls: ['./camp-view.component.scss']
})
export class CampViewComponent implements OnInit, OnDestroy {

  mapUrl:string;
  
  constructor(private layoutService:LayoutService, private titleService:TitleService, private configService:ConfigService, private router:Router) {
    this.layoutService.menu.transparent = true;
  }

  ngOnInit() {
    this.titleService.setTitle("Tábor");
    
    this.loadMapUrl();
  }

  ngOnDestroy(){
    this.layoutService.menu.transparent = false;
  }
  
  loadMapUrl(){
    this.configService.getConfig().then(config => {
      this.mapUrl = config.general.campMapUrl;
    });
  }
  
}
