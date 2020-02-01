import { Component, OnInit } from '@angular/core';

import { TitleService } from "app/core/services/title.service";
import { MenuService } from 'app/core/services/menu.service';
import { OnlineService } from 'app/core/services/online.service';

import { AclService } from 'lib/acl';
import { Router, ActivatedRoute } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { UserService } from 'app/core/services/user.service';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(
    public titleService: TitleService,
    public menuService: MenuService,
    public onlineService: OnlineService,
    public swUpdate: SwUpdate,

    private aclService: AclService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    const user = this.userService.userSnapshot;

    if (!user) {
      this.router.navigate(["login"], { relativeTo: this.route })
    }
    else {
      this.aclService.can("admin").toPromise().then(can => {
        if (!can) this.router.navigate(["/"])
      })
    }

  }

  reload() {
    window.location.reload();
  }


  onActivate() {
    this.titleService.reset();
    this.menuService.reset();
  }
  onDeactivate() {
  }



}
