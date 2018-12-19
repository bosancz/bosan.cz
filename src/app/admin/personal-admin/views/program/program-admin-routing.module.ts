import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgramAdminComponent } from "./program-admin.component";

import { EventPlanningComponent } from "./event-planning/event-planning.component";
import { EventApprovalComponent } from "./event-approval/event-approval.component";
import { EventProgramComponent } from "./event-program/event-program.component";

const routes: Routes = [

  {
    path: '', component: ProgramAdminComponent,
    children: [
      {path: 'planovani', component: EventPlanningComponent},  
      
      {path: 'v-programu', component: EventProgramComponent},  

      {path: 'ke-schvaleni', component: EventApprovalComponent},  

      {path: '', redirectTo: "ke-schvaleni", pathMatch: "full"}
    ]
  },  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramAdminRoutingModule { }
