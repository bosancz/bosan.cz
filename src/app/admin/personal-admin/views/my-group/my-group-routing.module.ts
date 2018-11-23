import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyGroupComponent } from "./my-group.component";
import { GroupMembersComponent } from './group-members/group-members.component';

const routes: Routes = [
  {
    path: "",
    component: MyGroupComponent,
    children: [
      { path: "clenove", component: GroupMembersComponent },
      { path: "", redirectTo: "clenove", pathMatch: "full" }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyGroupRoutingModule { }
