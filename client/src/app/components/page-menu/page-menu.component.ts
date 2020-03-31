import { Component, EventEmitter, Output } from '@angular/core';

import { ConfigService } from "app/services/config.service";
import { TitleService } from 'app/services/title.service';

import { MenuService } from 'app/services/menu.service';
import { map } from 'rxjs/operators';


@Component({
  selector: 'page-menu',
  templateUrl: './page-menu.component.html',
  styleUrls: ['./page-menu.component.scss']
})
export class PageMenuComponent {

  isTop: boolean = true;

  environment$ = this.configService.config.pipe(map(config => config.general.environment));

  collapsed: boolean = true;

  @Output()
  collapse = new EventEmitter<boolean>();

  constructor(
    public menuService: MenuService,
    public titleService: TitleService,
    private configService: ConfigService,
  ) { }

  setCollapsed(collapsed: boolean) {
    this.collapsed = collapsed
    this.collapse.emit(collapsed);
  }
}
