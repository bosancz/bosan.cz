import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { AclService } from "./acl.service";

@Directive({
  selector: '[aclCan]'
})
export class AclCanDirective {

  permission:string|string[];
  
  private hasView = false;

  @Input() set aclCan(permission:string|string[]){
    this.permission = permission;
    this.updateView();
  }

  constructor(private templateRef: TemplateRef<any>,private viewContainer: ViewContainerRef, private aclService:AclService) {
    aclService.onUpdate.subscribe(() => this.updateView());
  }

  async updateView():Promise<void>{

    const can = await this.aclService.can(this.permission);

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