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
    // render for large display
    this.viewContainer.createEmbeddedView(this.templateRef);

    // display in menu for mobile
    this.menuService.menuButtons.push(this.templateRef);
    console.log(this.menuService.menuButtons);
  }

  ngOnDestroy() {
    this.menuService.menuButtons.splice(this.menuService.menuButtons.indexOf(this.templateRef), 1);
  }

}
