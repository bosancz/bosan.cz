import { Component, OnInit } from '@angular/core';

import { TitleService } from "app/core/services/title.service";
import { FooterService } from 'app/core/services/footer.service';
import { MenuService } from 'app/core/services/menu.service';
import { OnlineService } from 'app/core/services/online.service';

import { AclService } from 'lib/acl';
import { combineAll } from 'rxjs/operators';
import { combineLatest, Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {


  private menuSubscription: Subscription;

  constructor(
    public titleService: TitleService,
    public menuService: MenuService,
    public onlineService: OnlineService,
    public swUpdate: SwUpdate,
    private footerService: FooterService,
    private aclService: AclService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.titleService.setPageTitle("Můj Bošán");
    this.footerService.hide();

    this.setMenu();
  }

  ngOnDestroy() {
    this.footerService.reset();
    this.menuService.reset();
  }

  setMenu() {

    const menu = [
      
    ];


    this.menuSubscription = combineLatest(menu.map(item => item.permission)).subscribe(permissions => {
      const filteredMenu = menu
        .filter((item, i) => permissions[i])
        .map(item => ({
          path: this.router.serializeUrl(this.router.createUrlTree(item.path, { relativeTo: this.route })),
          label: item.label
        }));

      console.log(filteredMenu);
      this.menuService.setSecondaryMenu(filteredMenu);
    });

  }

  reload() {
    window.location.reload();
  }

}
