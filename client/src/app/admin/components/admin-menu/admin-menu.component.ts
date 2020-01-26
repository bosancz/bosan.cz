import { Component, OnInit } from '@angular/core';
import { TitleService } from 'app/core/services/title.service';
import { MenuService } from 'app/core/services/menu.service';

@Component({
  selector: 'admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminMenuComponent implements OnInit {

  collapsed: boolean = true;

  constructor(
    public titleService: TitleService,
    public menuService: MenuService
  ) { }

  ngOnInit() {
  }

}
