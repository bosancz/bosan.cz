import { Directive, ViewContainerRef, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import { MenuService } from 'app/services/menu.service';

@Directive({
  selector: '[menuButton]'
})
export class MenuButtonDirective implements OnInit, OnDestroy {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private menuService: MenuService,
  ) {

  }

  ngOnInit() {
    // display in menu for mobile
    this.menuService.menuButtons.push(this.templateRef);
  }

  ngOnDestroy() {
    this.menuService.menuButtons.splice(this.menuService.menuButtons.indexOf(this.templateRef), 1);
  }

}
