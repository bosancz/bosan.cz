import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'app/shared/modules/material/material.module';
import { SharedModule } from 'app/shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardCalendarComponent } from './views/dashboard-calendar/dashboard-calendar.component';
import { DashboardLeadEventComponent } from './views/dashboard-lead-event/dashboard-lead-event.component';
import { DashboardMyEventsComponent } from "./views/dashboard-my-events/dashboard-my-events.component";
import { DashboardNewsComponent } from './views/dashboard-news/dashboard-news.component';


@NgModule({
  declarations: [
    DashboardComponent,
    DashboardCalendarComponent,
    DashboardLeadEventComponent,
    DashboardNewsComponent,
    DashboardMyEventsComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    MaterialModule
  ]
})
export class DashboardModule { }
