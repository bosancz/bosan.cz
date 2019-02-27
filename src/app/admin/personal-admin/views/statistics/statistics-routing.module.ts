import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatisticsComponent } from "./statistics.component";

import { EventsDashboardComponent } from './events-dashboard/events-dashboard.component';
import { EventsCompetitionComponent } from './events-competition/events-competition.component';
import { MembersDashboardComponent } from './members-dashboard/members-dashboard.component';

const routes: Routes = [

  {
    path: '',
    component: StatisticsComponent,
    children: [

      { path: 'akce', component: EventsDashboardComponent },

      { path: 'clenove', component: MembersDashboardComponent },

      { path: 'vodak-roku', component: EventsCompetitionComponent },

      { path: '', redirectTo: "akce", pathMatch: "full"}
      
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticsRoutingModule { }
