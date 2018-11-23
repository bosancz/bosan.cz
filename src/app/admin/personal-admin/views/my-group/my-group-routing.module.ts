import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ACLService } from "app/services/acl.service";

import { MyGroupComponent } from "./my-group.component";
import { GroupMembersComponent } from './group-members/group-members.component';

const routes: Routes = [
  {
    path: "",
    component: MyGroupComponent,
    children: [
      { path: "clenove", component: GroupMembersComponent, canActivate: [ACLService] },
      { path: "", redirectTo: "clenove", pathMatch: "full" }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyGroupRoutingModule { }
