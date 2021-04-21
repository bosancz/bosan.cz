import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from 'app/shared/shared.module';

import { ChartsModule } from 'ng2-charts';

import { StatisticsRoutingModule } from './statistics-routing.module';
import { StatisticsComponent } from './statistics.component';

import { EventsDashboardComponent } from './events-dashboard/events-dashboard.component';

import { MembersDashboardComponent } from './members-dashboard/members-dashboard.component';
import { PaddlerCompetitionComponent } from './paddler-competition/paddler-competition.component';
import { MaterialModule } from 'app/shared/modules/material.module';


@NgModule({
  declarations: [
    StatisticsComponent,
    EventsDashboardComponent,
    MembersDashboardComponent,
    PaddlerCompetitionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    StatisticsRoutingModule,

    ChartsModule,
  ]
})
export class StatisticsModule { }
