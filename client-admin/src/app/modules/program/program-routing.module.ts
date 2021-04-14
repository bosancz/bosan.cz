import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgramWorkflowComponent } from './views/program-workflow/program-workflow.component';
import { ProgramPlanningComponent } from './views/program-planning/program-planning.component';
import { ProgramPrintComponent } from './components/program-print/program-print.component';
import { ProgramViewComponent } from './views/program-view/program-view.component';

const routes: Routes = [

  { path: 'schvalovani', component: ProgramWorkflowComponent },
  { path: 'planovani', component: ProgramPlanningComponent },
  { path: 'tisk', component: ProgramPrintComponent },
  { path: '', component: ProgramViewComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramRoutingModule { }
