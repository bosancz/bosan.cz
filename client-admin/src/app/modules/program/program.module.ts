import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'app/shared/shared.module';

import { ProgramRoutingModule } from './program-routing.module';

import { ProgramPlanningComponent } from './views/program-planning/program-planning.component';
import { ProgramWorkflowComponent } from './views/program-workflow/program-workflow.component';
import { ProgramPrintComponent } from './views/program-print/program-print.component';
import { TrimesterSelectorComponent } from './components/trimester-selector/trimester-selector.component';
import { ProgramCalendarComponent } from './views/program-calendar/program-calendar.component';
import { ProgramComponent } from './program.component';
import { EventStatusLegendComponent } from './components/event-status-legend/event-status-legend.component';


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
    ProgramCalendarComponent,
    ProgramComponent,
    EventStatusLegendComponent
  ]
})
export class ProgramModule { }
