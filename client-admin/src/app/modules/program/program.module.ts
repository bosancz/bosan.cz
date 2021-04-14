import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'app/shared/shared.module';

import { ProgramRoutingModule } from './program-routing.module';

import { ProgramPlanningComponent } from './views/program-planning/program-planning.component';
import { ProgramWorkflowComponent } from './views/program-workflow/program-workflow.component';
import { ProgramPrintComponent } from './components/program-print/program-print.component';
import { TrimesterSelectorComponent } from './components/trimester-selector/trimester-selector.component';
import { ProgramViewComponent } from './views/program-view/program-view.component';


@NgModule({
  imports: [
    CommonModule,
    ProgramRoutingModule,
    SharedModule,
  ],
  declarations: [
    ProgramPlanningComponent,
    ProgramWorkflowComponent,
    ProgramPrintComponent,
    TrimesterSelectorComponent,
    ProgramViewComponent
  ]
})
export class ProgramModule { }
