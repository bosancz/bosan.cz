import { Component, OnInit, Input, TemplateRef, ViewContainerRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MenuService } from 'app/services/menu.service';

@Component({
  selector: 'secondary-menu',
  templateUrl: './secondary-menu.component.html',
  styleUrls: ['./secondary-menu.component.scss'],
  host: {
    class: "p-3"
  }
})
export class SecondaryMenuComponent implements AfterViewInit, OnDestroy {

  @Input() render = true;
  @Input() vertical = false;

  @ViewChild("menuContent") menuRef: TemplateRef<HTMLElement>;

  constructor(
    private menuService: MenuService,
  ) {

  }

  ngAfterViewInit() {
    console.log(this.menuRef)
    // display in menu for mobile
    this.menuService.secondaryMenu = this.menuRef;
  }

  ngOnDestroy() {
    this.menuService.secondaryMenu = null;
  }

}
