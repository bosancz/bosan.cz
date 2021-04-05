import { Directive, OnInit, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { MenuService } from 'app/core/services/menu.service';

@Directive({
  selector: '[secondaryMenu]'
})
export class SecondaryMenuDirective implements OnInit, OnDestroy {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private menuService: MenuService,
  ) {

  }

  ngOnInit() {

    // render for large display
    this.viewContainer.createEmbeddedView(this.templateRef);

    // display in menu for mobile
    this.menuService.secondaryMenu = this.templateRef;
  }

  ngOnDestroy() {
    this.menuService.secondaryMenu = null;
  }


}
