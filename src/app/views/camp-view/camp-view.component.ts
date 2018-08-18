import { Component, OnInit, OnDestroy } from '@angular/core';

import { MenuService } from "../../services/menu.service";
import { TitleService } from "../../services/title.service";

@Component({
  selector: 'camp-view',
  templateUrl: './camp-view.component.html',
  styleUrls: ['./camp-view.component.css']
})
export class CampViewComponent implements OnInit, OnDestroy {

  constructor(private menuService:MenuService, private titleService:TitleService) {
    this.menuService.transparent = true;
  }
  
  ngOnInit() {
    this.titleService.setTitle("Tábor");
  }
  
  ngOnDestroy(){
    this.menuService.transparent = false;
  }

}
