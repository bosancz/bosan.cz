import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminSharedModule } from 'app/admin/shared/admin-shared.module';

import { ChartsModule } from 'ng2-charts';

import { StatisticsRoutingModule } from './statistics-routing.module';
import { StatisticsComponent } from './statistics.component';

import { EventsDashboardComponent } from './events-dashboard/events-dashboard.component';

import { MembersDashboardComponent } from './members-dashboard/members-dashboard.component';

@NgModule({
  declarations: [
    StatisticsComponent,
    EventsDashboardComponent,
    MembersDashboardComponent
  ],
  imports: [
    CommonModule,
    AdminSharedModule,
    StatisticsRoutingModule,
    FormsModule,
    ChartsModule
  ]
})
export class StatisticsModule { }
