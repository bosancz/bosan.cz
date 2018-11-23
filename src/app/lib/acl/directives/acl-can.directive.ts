import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { AclService } from "../services/acl.service";

@Directive({
  selector: '[aclCan]'
})
export class AclCanDirective {

  private hasView = false;

  @Input() set aclCan(permission:string|string[]){
    this.updateView(permission);
  }

  constructor(private templateRef: TemplateRef<any>,private viewContainer: ViewContainerRef, private aclService:AclService) {

  }

  async updateView(permission:string|string[]):Promise<void>{

    const can = await this.aclService.can(permission);

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