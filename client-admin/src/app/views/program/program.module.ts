import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'app/shared/shared.module';

import { ProgramRoutingModule } from './program-routing.module';

import { ProgramComponent } from './program.component';

import { ProgramPlanningComponent } from './views/program-planning/program-planning.component';
import { ProgramWorkflowComponent } from './views/program-workflow/program-workflow.component';
import { ProgramPrintComponent } from './views/program-print/program-print.component';


@NgModule({
  imports: [
    CommonModule,
    ProgramRoutingModule,
    SharedModule
  ],
  declarations: [
    ProgramComponent,

    /* VIEWS */
    ProgramPlanningComponent,
    ProgramWorkflowComponent,
    ProgramPrintComponent

  ]
})
export class ProgramModule { }
