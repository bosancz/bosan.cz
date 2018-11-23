import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyGroupRoutingModule } from './my-group-routing.module';

import { MyGroupComponent } from "./my-group.component";
import { GroupMembersComponent } from './group-members/group-members.component';

@NgModule({
  declarations: [MyGroupComponent, GroupMembersComponent],
  imports: [
    CommonModule,
    MyGroupRoutingModule
  ]
})
export class MyGroupModule { }
