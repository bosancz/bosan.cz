import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppSharedModule } from "app/shared/app-shared.module";
import { AdminSharedModule } from 'app/admin/shared/admin-shared.module';

import { ProgramRoutingModule } from './program-routing.module';

import { ProgramComponent } from './program.component';

import { ProgramPlanningComponent } from './views/program-planning/program-planning.component';
import { ProgramWorkflowComponent } from './views/program-workflow/program-workflow.component';

import { ProgramEventsListComponent } from './components/program-events-list/program-events-list.component';


@NgModule({
  imports: [
    CommonModule,
    ProgramRoutingModule,

    AppSharedModule,
    AdminSharedModule

  ],
  declarations: [
    ProgramComponent,
    
    /* VIEWS */
    ProgramPlanningComponent,
    ProgramWorkflowComponent,

    /* COMPONENTS */
    ProgramEventsListComponent,
  ]
})
export class ProgramModule { }
