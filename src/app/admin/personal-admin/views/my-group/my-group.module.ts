import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyGroupRoutingModule } from './my-group-routing.module';

import { AppSharedModule } from "app/modules/app-shared.module";
import { AdminSharedModule } from "app/admin/modules/admin-shared.module";

import { MyGroupComponent } from "./my-group.component";
import { MyGroupMembersComponent } from './my-group-members/my-group-members.component';

@NgModule({
  declarations: [MyGroupComponent, MyGroupMembersComponent],
  imports: [
    CommonModule,
    MyGroupRoutingModule,
    AppSharedModule,
    AdminSharedModule
  ]
})
export class MyGroupModule { }
