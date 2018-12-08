import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyGroupComponent } from "./my-group.component";
import { MyGroupMembersComponent } from './my-group-members/my-group-members.component';

const routes: Routes = [
  {
    path: "",
    component: MyGroupComponent,
    children: [
      { path: "clenove", component: MyGroupMembersComponent },
      { path: "", redirectTo: "clenove", pathMatch: "full" }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyGroupRoutingModule { }
