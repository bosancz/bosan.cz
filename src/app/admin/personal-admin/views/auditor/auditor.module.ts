import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import "assets/lib/Chart.min.js";

import { ChartsModule } from 'ng2-charts';

import { AuditorRoutingModule } from './auditor-routing.module';
import { EventReportsComponent } from './event-reports/event-reports.component';
import { AuditorComponent } from './auditor.component';
import { EventsDashboardComponent } from './events-dashboard/events-dashboard.component';

@NgModule({
  declarations: [EventReportsComponent, AuditorComponent, EventsDashboardComponent],
  imports: [
    CommonModule,
    AuditorRoutingModule,
    FormsModule,
    ChartsModule
  ]
})
export class AuditorModule { }
