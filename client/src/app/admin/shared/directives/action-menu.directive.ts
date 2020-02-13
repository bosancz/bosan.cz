import { Directive, ViewContainerRef, TemplateRef, OnInit, AfterViewInit, Input, OnDestroy, ElementRef } from '@angular/core';
import { MenuService } from 'app/core/services/menu.service';

@Directive({
  selector: '[actionMenu]'
})
export class ActionMenuDirective implements OnInit, OnDestroy {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private menuService: MenuService,
  ) {

  }

  ngOnInit() {
    // render for large display
    const embeddedViewRef = this.viewContainer.createEmbeddedView(this.templateRef);
    
    // display in menu for mobile
    this.menuService.actionMenu = this.templateRef;
  }

  ngOnDestroy() {
    this.menuService.actionMenu = null;
  }

}
