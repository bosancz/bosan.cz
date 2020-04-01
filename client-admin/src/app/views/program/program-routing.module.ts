import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgramComponent } from "./program.component";

import { ProgramWorkflowComponent } from './views/program-workflow/program-workflow.component';
import { ProgramPlanningComponent } from './views/program-planning/program-planning.component';

const routes: Routes = [

  {
    path: '',
    component: ProgramComponent,
    children: [
      { path: '', component: ProgramWorkflowComponent },
      { path: 'planovani', component: ProgramPlanningComponent },
    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramRoutingModule { }
