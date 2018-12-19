import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppSharedModule } from "app/modules/app-shared.module";

import { ProgramAdminRoutingModule } from './program-admin-routing.module';
import { ProgramAdminComponent } from './program-admin.component';

import { EventPlanningComponent } from './event-planning/event-planning.component';
import { EventApprovalComponent } from './event-approval/event-approval.component';
import { EventProgramComponent } from './event-program/event-program.component';

@NgModule({
  imports: [
    CommonModule,
    
    AppSharedModule,
    
    ProgramAdminRoutingModule
  ],
  declarations: [
    ProgramAdminComponent,
    EventPlanningComponent, EventApprovalComponent, EventProgramComponent
  ]
})
export class ProgramAdminModule { }
