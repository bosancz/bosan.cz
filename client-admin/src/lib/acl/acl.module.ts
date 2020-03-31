import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AclCanDirective } from './acl-can.directive';

@NgModule({
  declarations: [
    AclCanDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AclCanDirective
  ]
})
export class AclModule { }
