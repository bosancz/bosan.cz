import { Component, Input } from '@angular/core';

import { OnlineService } from "app/core/services/online.service";
import { UserService } from "app/core/services/user.service";
import { AclService } from "lib/acl";
import { ConfigService } from "app/core/services/config.service";
import { TitleService } from 'app/core/services/title.service';

import { MenuService } from 'app/core/services/menu.service';
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

  constructor(
    public aclService: AclService,
    public userService: UserService,
    public menuService: MenuService,
    public onlineService: OnlineService,
    public titleService: TitleService,
    private configService: ConfigService,
  ) { }

}
