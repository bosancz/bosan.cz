import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgramAdminComponent } from "./program-admin.component";

import { EventPlanningComponent } from "./event-planning/event-planning.component";
import { EventApprovalComponent } from "./event-approval/event-approval.component";

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
