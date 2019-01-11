import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppSharedModule } from "app/modules/app-shared.module";

import { ProgramAdminRoutingModule } from './program-admin-routing.module';
import { ProgramAdminComponent } from './program-admin.component';

import { EventPlanningComponent } from './views/event-planning/event-planning.component';
import { EventApprovalComponent } from './views/event-approval/event-approval.component';
import { EventProgramComponent } from './views/event-program/event-program.component';

import { ProgramEventsListComponent } from './components/program-events-list/program-events-list.component';
import { ProgramDraftsComponent } from './views/program-drafts/program-drafts.component';

@NgModule({
  imports: [
    CommonModule,
    
    AppSharedModule,
    
    ProgramAdminRoutingModule
  ],
  declarations: [
    ProgramAdminComponent,
    EventPlanningComponent, EventApprovalComponent, EventProgramComponent,
    ProgramEventsListComponent,
    ProgramDraftsComponent
  ]
})
export class ProgramAdminModule { }
