import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgramAdminComponent } from "app/account/views/program-admin/program-admin.component";

import { EventPlanningComponent } from "app/account/views/program-admin/event-planning/event-planning.component";
import { EventApprovalComponent } from "app/account/views/program-admin/event-approval/event-approval.component";

const routes: Routes = [

  {
    path: '', component: ProgramAdminComponent,
    children: [
      {path: 'planovani-akci', component: EventPlanningComponent},  

      {path: 'schvalovani-akci', component: EventApprovalComponent},  

      {path: '', redirectTo: "schvalovani-akci", pathMatch: "full"}
    ]
  },  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramAdminRoutingModule { }
