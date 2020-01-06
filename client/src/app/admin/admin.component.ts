import { Component, OnInit } from '@angular/core';

import { TitleService } from "app/core/services/title.service";
import { FooterService } from 'app/core/services/footer.service';
import { MenuService } from 'app/core/services/menu.service';
import { AclService } from 'lib/acl';
import { combineAll } from 'rxjs/operators';
import { combineLatest, Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {


  private menuSubscription: Subscription;

  constructor(
    public titleService: TitleService,
    private footerService: FooterService,
    public menuService: MenuService,
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
      { permission: this.aclService.can("admin:dashboard"), path: ["prehled"], label: "Přehled" },
      { permission: this.aclService.can("admin:events"), path: ["akce"], label: "Akce" },
      { permission: this.aclService.can("admin:albums"), path: ["galerie"], label: "Galerie" },
      { permission: this.aclService.can("admin:members"), path: ["databaze"], label: "Databáze" },
      { permission: this.aclService.can("admin:program"), path: ["program"], label: "Správa programu" },
      { permission: this.aclService.can("admin:statistics"), path: ["statistiky"], label: "Statistiky" },
      { permission: this.aclService.can("admin:canal"), path: ["kanal"], label: "Troja" },
      { permission: this.aclService.can("admin:account"), path: ["ucet"], label: "Nastavení účtu" },
      { permission: this.aclService.can("admin:users"), path: ["uzivatele"], label: "Uživatelé" },
      { permission: this.aclService.can("admin:web-settings"), path: ["nastaveni-webu"], label: "Nastavení webu" }
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

}
