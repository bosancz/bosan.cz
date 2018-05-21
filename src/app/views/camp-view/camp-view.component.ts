import { Component, OnInit, OnDestroy } from '@angular/core';

import { MenuService } from "../../services/menu.service";

@Component({
  selector: 'camp-view',
  templateUrl: './camp-view.component.html',
  styleUrls: ['./camp-view.component.css']
})
export class CampViewComponent implements OnInit, OnDestroy {

  constructor(private menuService:MenuService) {
    this.menuService.transparent = true;
  }

  ngOnInit() {
  }
  
  ngOnDestroy(){
    this.menuService.transparent = false;
  }

}
