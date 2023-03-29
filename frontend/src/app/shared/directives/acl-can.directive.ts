import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { AclService } from "../../core/services/acl.service";
import { Subscription } from 'rxjs';

@Directive({
  selector: '[aclCan]'
})
export class AclCanDirective {

  private hasView = false;


  permission?: string | string[];

  private subscription?: Subscription;

  @Input() set aclCan(permission: string | string[]) {

    if (this.permission !== permission) {

      this.subscription?.unsubscribe();

      this.subscription = this.aclService.can(permission).subscribe(can => this.updateView(can));

      this.permission = permission;
    }

  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private aclService: AclService
  ) { }

  updateView(can: boolean): void {

    if (can && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    }
    else if (!can && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }

  }

}