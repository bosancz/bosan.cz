import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import "assets/lib/Chart.min.js";

import { ChartsModule } from 'ng2-charts';

import { StatisticsRoutingModule } from './statistics-routing.module';
import { StatisticsComponent } from './statistics.component';
import { EventsDashboardComponent } from './events-dashboard/events-dashboard.component';
import { EventsCompetitionComponent } from './events-competition/events-competition.component';

@NgModule({
  declarations: [StatisticsComponent, EventsDashboardComponent, EventsCompetitionComponent],
  imports: [
    CommonModule,
    StatisticsRoutingModule,
    FormsModule,
    ChartsModule
  ]
})
export class StatisticsModule { }
