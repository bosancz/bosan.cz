import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppSharedModule } from "app/shared/app-shared.module";
import { AdminSharedModule } from 'app/admin/shared/admin-shared.module';

import { ProgramRoutingModule } from './program-routing.module';
import { ProgramComponent } from './program.component';

import { EventPlanningComponent } from './views/event-planning/event-planning.component';
import { EventApprovalComponent } from './views/event-approval/event-approval.component';
import { EventProgramComponent } from './views/event-program/event-program.component';

import { ProgramEventsListComponent } from './components/program-events-list/program-events-list.component';
import { ProgramDraftsComponent } from './views/program-drafts/program-drafts.component';


@NgModule({
  imports: [
    CommonModule,
    ProgramRoutingModule,
    
    AppSharedModule,
    AdminSharedModule
    
  ],
  declarations: [
    ProgramComponent,
    EventPlanningComponent, EventApprovalComponent, EventProgramComponent,
    ProgramEventsListComponent,
    ProgramDraftsComponent
  ]
})
export class ProgramModule { }
