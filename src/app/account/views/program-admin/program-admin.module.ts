import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from "app/modules/shared.module";

import { ProgramAdminRoutingModule } from 'app/account/views/program-admin/program-admin-routing.module';
import { ProgramAdminComponent } from 'app/account/views/program-admin/program-admin.component';

import { EventPlanningComponent } from 'app/account/views/program-admin/event-planning/event-planning.component';
import { EventApprovalComponent } from 'app/account/views/program-admin/event-approval/event-approval.component';

@NgModule({
  imports: [
    CommonModule,
    
    SharedModule,
    
    ProgramAdminRoutingModule
  ],
  declarations: [
    ProgramAdminComponent,
    EventPlanningComponent, EventApprovalComponent
  ]
})
export class ProgramAdminModule { }
