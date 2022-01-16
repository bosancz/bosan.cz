import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgramWorkflowComponent } from './views/program-workflow/program-workflow.component';
import { ProgramPlanningComponent } from './views/program-planning/program-planning.component';
import { ProgramPrintComponent } from './views/program-print/program-print.component';
import { ProgramCalendarComponent } from './views/program-calendar/program-calendar.component';
import { ProgramComponent } from './program.component';

const routes: Routes = [

  {
    path: '', component: ProgramComponent,
    children: [
      { path: 'planovani', component: ProgramPlanningComponent },
      { path: 'tisk', component: ProgramPrintComponent },
      { path: 'kalendar', component: ProgramCalendarComponent },
      { path: 'schvalovani', component: ProgramWorkflowComponent },
      { path: '', pathMatch: "full", redirectTo: "kalendar" }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramRoutingModule { }
