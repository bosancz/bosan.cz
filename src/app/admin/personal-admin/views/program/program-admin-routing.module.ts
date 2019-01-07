import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgramAdminComponent } from "./program-admin.component";

import { ProgramDraftsComponent } from "./views/program-drafts/program-drafts.component";
import { EventApprovalComponent } from "./views/event-approval/event-approval.component";
import { EventPlanningComponent } from "./views/event-planning/event-planning.component";
import { EventProgramComponent } from "./views/event-program/event-program.component";

const routes: Routes = [

  {
    path: '', component: ProgramAdminComponent,
    children: [
      {path: 'v-priprave', component: ProgramDraftsComponent},  
      
      {path: 'ke-schvaleni', component: EventApprovalComponent},  
      
      {path: 'v-programu', component: EventProgramComponent},  

      {path: 'planovani', component: EventPlanningComponent},  

      {path: '', redirectTo: "ke-schvaleni", pathMatch: "full"}
    ]
  },  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramAdminRoutingModule { }
