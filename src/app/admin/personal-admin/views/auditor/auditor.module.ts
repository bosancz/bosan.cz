import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuditorRoutingModule } from './auditor-routing.module';
import { EventReportsComponent } from './event-reports/event-reports.component';
import { AuditorComponent } from './auditor.component';

@NgModule({
  declarations: [EventReportsComponent, AuditorComponent],
  imports: [
    CommonModule,
    AuditorRoutingModule
  ]
})
export class AuditorModule { }
